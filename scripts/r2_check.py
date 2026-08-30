#!/usr/bin/env python3
"""
r2_check.py - prove the R2 credentials and the public domain work.

Reads .env from the repo root. NEVER prints a secret: the access key is
masked and the secret is only ever handed to boto3.

    python scripts/r2_check.py                 read-only: auth + list
    python scripts/r2_check.py --roundtrip     also PUT a tiny probe object,
                                               fetch it over img.aroidpedia.com,
                                               then DELETE it

The roundtrip is what actually proves the whole chain - write access, the
custom domain, and the cache path - before any real photo is uploaded.
"""
import os
import sys
import urllib.request
from pathlib import Path

# This machine sits behind a Zscaler TLS-inspecting proxy whose root CA lives
# in the Windows certificate store, NOT in certifi. botocore validates against
# certifi and therefore fails with CERTIFICATE_VERIFY_FAILED. truststore points
# Python's ssl module at the OS store instead, which fixes boto3, urllib3 and
# requests alike. Must run before any TLS connection is opened.
try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    print("note: truststore not installed - TLS may fail behind the proxy "
          "(pip install truststore)", file=sys.stderr)

REPO = Path(__file__).resolve().parent.parent
ENV = REPO / ".env"

REQUIRED = ("R2_ACCOUNT_ID", "R2_BUCKET", "R2_PUBLIC_BASE",
            "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY")


def load_env() -> dict:
    if not ENV.exists():
        sys.exit(f"No .env at {ENV}")
    cfg = {}
    for line in ENV.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        cfg[k.strip()] = v.strip()
    missing = [k for k in REQUIRED if not cfg.get(k)]
    if missing:
        sys.exit("Not filled in yet: " + ", ".join(missing)
                 + "\nPaste the token values into .env, then re-run.")
    return cfg


def mask(s: str) -> str:
    return s[:4] + "..." + s[-2:] if len(s) > 8 else "set"


def main() -> None:
    cfg = load_env()
    import boto3
    from botocore.exceptions import ClientError

    endpoint = f"https://{cfg['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com"
    bucket = cfg["R2_BUCKET"]

    print(f"endpoint   {endpoint}")
    print(f"bucket     {bucket}")
    print(f"access key {mask(cfg['R2_ACCESS_KEY_ID'])}")
    print()

    s3 = boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=cfg["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=cfg["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
    )

    try:
        s3.head_bucket(Bucket=bucket)
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "?")
        sys.exit(f"FAIL  cannot reach bucket ({code}). "
                 "Check the keys, and that the token is scoped to this bucket.")
    print("PASS  credentials valid, bucket reachable")

    n = total = 0
    token = None
    while True:
        kw = {"Bucket": bucket, "MaxKeys": 1000}
        if token:
            kw["ContinuationToken"] = token
        r = s3.list_objects_v2(**kw)
        for o in r.get("Contents", []):
            n += 1
            total += o["Size"]
        if not r.get("IsTruncated"):
            break
        token = r.get("NextContinuationToken")
    print(f"PASS  list works - {n} object(s), {total / 1048576:.1f} MB")

    if "--roundtrip" not in sys.argv:
        print("\nRun with --roundtrip to also test write + public fetch.")
        return

    key = "_probe/r2-check.txt"
    body = b"aroidpedia r2 probe"
    print()
    try:
        s3.put_object(Bucket=bucket, Key=key, Body=body,
                      ContentType="text/plain",
                      CacheControl="no-store")
        print(f"PASS  wrote {key}")
    except ClientError as e:
        sys.exit(f"FAIL  write refused ({e.response.get('Error', {}).get('Code', '?')}). "
                 "Token probably has read-only permission.")

    url = cfg["R2_PUBLIC_BASE"].rstrip("/") + "/" + key
    # Cloudflare's bot rules 403 the default "Python-urllib/x.y" User-Agent.
    # Browsers loading <img> are unaffected, but any checker must identify
    # itself as something else or it reports false failures.
    req = urllib.request.Request(url, headers={"User-Agent": "aroidpedia-sync/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            got = resp.read()
            served_by = resp.headers.get("server", "?")
        if got == body:
            print(f"PASS  fetched over {cfg['R2_PUBLIC_BASE']} (server: {served_by})")
        else:
            print("FAIL  public fetch returned unexpected content")
    except Exception as e:
        print(f"FAIL  public fetch failed: {e}")
        print("      the object exists, so this points at the custom domain, not the bucket.")

    s3.delete_object(Bucket=bucket, Key=key)
    print(f"PASS  deleted {key} - bucket is empty again")


if __name__ == "__main__":
    main()
