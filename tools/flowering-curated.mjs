/* THE CURATED FLOWERING TABLE — hand-verified, 8.17.26.

   Mined from the live Amorphophallus post bodies, then read one by one.
   The miner alone was NOT trustworthy in either direction:

     · it FLAGGED four of the best sources, because the sentence also
       mentions fruiting ("flowers from May to June and fruits in June
       and July") — the flowering range is stated first and is correct
     · it PASSED antsingyensis as clean when "flowering Oct., Bosser
       18117 (P, inflor.)" is a herbarium specimen citation, not a
       phenology statement
     · it MISSED bulbifer, because "Inflorescences typically appears in
       April-June" puts a word between the noun and the verb

   So this file is the record of a human decision, not a script's
   output. Every row carries the sentence it came from.

   ⚠ COVERAGE IS 12 OF 110 POSTS. The bulk import is at a–i, so this
   grows on its own as more species land — the renderer must treat
   absence as normal, never as an error.                              */

export const FLOWERING = {
  /* species                from  to    the sentence it rests on */
  'AMORPHOPHALLUS BOGNERIANUS':  { m: [4, 5],  s: 'Flowering: May-June.' },
  'AMORPHOPHALLUS BULBIFER':     { m: [3, 5],  s: 'Inflorescences typically appears in April-June.' },
  'AMORPHOPHALLUS CALCICOLUS':   { m: [5, 6],  s: 'Flowering from June to July.' },
  'AMORPHOPHALLUS CARNOSUS':     { m: [4, 5],  s: 'Phenology: Flowering: May-June.' },
  'AMORPHOPHALLUS CAUDATUS':     { m: [2, 3],  s: 'Observed flowering in March–April, and fruiting in late April–May.' },
  'AMORPHOPHALLUS COMMUTATUS':   { m: [4, 5],  s: 'Phenology: Flowering: May-June.',
    note: 'the post also says "Flowering: June" once; May-June appears twice and is the wider claim' },
  'AMORPHOPHALLUS DRACONTIOIDES':{ m: [11, 1], s: 'Flowers from December through the end of February.' },
  'AMORPHOPHALLUS DUMBOI':       { m: [7, 3],  s: 'Observed in flower from August to April.',
    note: 'NINE MONTHS — unusually wide. Kept as stated; an equatorial DR Congo species may genuinely flower across most of the year, but it is the one row worth a second opinion' },
  'AMORPHOPHALLUS FALLAX':       { m: [4, 5],  s: 'Flowers from May to June and fruits in June and July.' },
  'AMORPHOPHALLUS FLAMMEUS':     { m: [2, 3],  s: 'Observed flowering in March–April, and fruiting in late April–May.' },
  'AMORPHOPHALLUS FLOTOI':       { m: [3, 7],  s: 'Flowers from April to August and fruits from (May–)October to December.' },
  'AMORPHOPHALLUS FONTARUMII':   { m: [4, 5],  s: 'Flowering from May to June.' }
};

/* REJECTED, and why — kept so the next pass does not re-litigate them */
export const REJECTED = {
  'AMORPHOPHALLUS ANTSINGYENSIS': 'herbarium specimen citation (Bosser 18117 (P, inflor.)), not phenology',
  'AMORPHOPHALLUS ANKARANA':      'one plant, one day: "flowered 20 October 1995"',
  'AMORPHOPHALLUS ANGOLENSIS':    'specimen label "(with flower) Dec."',
  'AMORPHOPHALLUS CANDIDISSIMUS': 'collection date "Inflorescence: 22 Jun."',
  'AMORPHOPHALLUS CIRRIFER':      'flowered in a EUROPEAN glasshouse in April — wrong hemisphere and wrong climate',
  'AMORPHOPHALLUS CRUDDASIANUS':  'Calcutta Herbarium sheets',
  'AMORPHOPHALLUS DECUS-SILVAE':  'cultivated at Buitenzorg, flowered November 1919',
  'AMORPHOPHALLUS EICHLERI':      'dated collection event',
  'AMORPHOPHALLUS ELLIOTII':      'dated collection event',
  'AMORPHOPHALLUS GIGAS':         'a cultivation observation diary, not a wild range',
  'AMORPHOPHALLUS ANDRANOGIDROENSIS': 'explicitly speculative — "Presumably flowering ... in November or December"'
};
