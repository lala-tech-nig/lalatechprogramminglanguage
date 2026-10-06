// WAZOBIA Multilingual Keyword Dictionary
// Supports English, Yoruba, Hausa, and Igbo with diacritics tolerance

export const CANONICAL_KEYWORDS = {
  // Loops & Control Flow
  FOR: {
    en: 'for',
    yo: ['fun', 'fún', 'fun_gbogbo'],
    ha: ['don', 'ga'],
    ig: ['maka']
  },
  IN: {
    en: 'in',
    yo: ['ninu', 'nínú'],
    ha: ['cikin', 'a_cikin'],
    ig: ['nime', 'na_ime']
  },
  WHILE: {
    en: 'while',
    yo: ['nigbati', 'nígbàtí'],
    ha: ['yayin', 'yayin_da'],
    ig: ['mgbe', 'nwa_oge']
  },
  IF: {
    en: 'if',
    yo: ['ti', 'tí', 'bi', 'bóyá'],
    ha: ['idan', 'idan_har'],
    ig: ['oburu', 'ọbụrụ', 'ma']
  },
  ELIF: {
    en: 'elif',
    yo: ['tabiti', 'tabití', 'tikoje'],
    ha: ['kodan', 'kokuma_idan'],
    ig: ['moburu', 'mọbụrụ']
  },
  ELSE: {
    en: 'else',
    yo: ['bikose', 'bikoṣe', 'bìkọ̀ṣe', 'tabi_omiran'],
    ha: ['inba_haka', 'kuma', 'akasin_haka'],
    ig: ['ozor', 'ọzọ', 'maobu']
  },

  // Logical Operators (Explicitly prioritized)
  AND: {
    en: 'and',
    yo: ['ati', 'àti'],
    ha: ['da'],
    ig: ['na']
  },
  OR: {
    en: 'or',
    yo: ['tabi', 'tàbí', 'abi'],
    ha: ['ko'],
    ig: ['maobu', 'mọbụ']
  },
  NOT: {
    en: 'not',
    yo: ['ko', 'kò', 'eewo'],
    ha: ['ba', 'babu_ba'],
    ig: ['abughi', 'abụghị', 'mba']
  },

  // Declarations & Bindings
  LET: {
    en: 'let',
    yo: ['je', 'jẹ́', 'kioje'],
    ha: ['bari'],
    ig: ['ka']
  },
  CONST: {
    en: 'const',
    yo: ['duro', 'dúró'],
    ha: ['tsaye'],
    ig: ['kwusie', 'kwụsie']
  },
  FN: {
    en: ['fn', 'function'],
    yo: ['ise', 'iṣẹ́', 'ise_owo'],
    ha: ['aiki'],
    ig: ['oru', 'ọrụ']
  },
  RETURN: {
    en: 'return',
    yo: ['pada', 'padà', 'da_pada'],
    ha: ['koma', 'mayar'],
    ig: ['lota', 'lọta', 'nyeghachi']
  },

  // Literals
  TRUE: {
    en: 'true',
    yo: ['otito', 'òótọ́', 'otitọ'],
    ha: ['gaskiya'],
    ig: ['eziokwu', 'ezie']
  },
  FALSE: {
    en: 'false',
    yo: ['iro', 'irọ́'],
    ha: ['kariya', 'ƙarya'],
    ig: ['asi', 'asị']
  },
  NULL: {
    en: ['null', 'nil'],
    yo: ['ofo', 'òfo'],
    ha: ['babu'],
    ig: ['efu']
  },

  // Object-Oriented Programming
  CLASS: {
    en: 'class',
    yo: ['egbe', 'ẹgbẹ́'],
    ha: ['aji'],
    ig: ['otu']
  },
  NEW: {
    en: 'new',
    yo: ['tuntun'],
    ha: ['sabo'],
    ig: ['ohuru', 'ọhụrụ']
  },
  THIS: {
    en: 'this',
    yo: ['eyi', 'èyí'],
    ha: ['wannan'],
    ig: ['nkea']
  },

  // Error Handling
  TRY: {
    en: 'try',
    yo: ['gbiyanju', 'gbìyànjú'],
    ha: ['gwada'],
    ig: ['nwaa']
  },
  CATCH: {
    en: 'catch',
    yo: ['mu', 'mú'],
    ha: ['kama'],
    ig: ['nwute']
  },
  FINALLY: {
    en: 'finally',
    yo: ['ni_ipari', 'ní_ìparí'],
    ha: ['a_karshe', 'a_ƙarshe'],
    ig: ['na_ikpeazu', 'na_ikpeazụ']
  },
  THROW: {
    en: 'throw',
    yo: ['ju', 'jù'],
    ha: ['jefa'],
    ig: ['tufuo']
  },

  // Async / Concurrency
  ASYNC: {
    en: 'async',
    yo: ['asiko', 'àsìkò'],
    ha: ['lokaci'],
    ig: ['oge']
  },
  AWAIT: {
    en: 'await',
    yo: ['duro_de', 'dúró_dé'],
    ha: ['jira'],
    ig: ['chere']
  },

  // Modules & Interoperability
  IMPORT: {
    en: 'import',
    yo: ['gba_wole', 'kole'],
    ha: ['shigo'],
    ig: ['bubata']
  },
  FROM: {
    en: 'from',
    yo: ['lati', 'láti'],
    ha: ['daga'],
    ig: ['site']
  },
  EXPORT: {
    en: 'export',
    yo: ['firanmo', 'tuka'],
    ha: ['fitar'],
    ig: ['bupuru']
  },
  AS: {
    en: 'as',
    yo: ['gegebi', 'gẹ́gẹ́bí'],
    ha: ['kamar'],
    ig: ['dika', 'dịka']
  },

  // Direct FFI tokens
  JS: {
    en: 'js',
    yo: 'js',
    ha: 'js',
    ig: 'js'
  },
  PY: {
    en: 'py',
    yo: 'py',
    ha: 'py',
    ig: 'py'
  },

  // Built-in output
  PRINT: {
    en: 'print',
    yo: ['te', 'tẹ', 'so'],
    ha: ['buga', 'fada'],
    ig: ['dee', 'kwuo']
  }
};

// Strip accents/diacritics for flexible normalization
export function normalizeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Build fast lookup map from word to canonical token
export const KEYWORD_LOOKUP = new Map();
export const PRIMARY_DIALECT_KEYWORD = {
  en: {},
  yo: {},
  ha: {},
  ig: {}
};

for (const [canonical, mapping] of Object.entries(CANONICAL_KEYWORDS)) {
  for (const [lang, words] of Object.entries(mapping)) {
    const wordList = Array.isArray(words) ? words : [words];
    // Record primary word for dialect
    PRIMARY_DIALECT_KEYWORD[lang][canonical] = wordList[0];

    for (const w of wordList) {
      const lower = w.toLowerCase();
      KEYWORD_LOOKUP.set(lower, canonical);
      KEYWORD_LOOKUP.set(normalizeDiacritics(lower), canonical);
    }
  }
}
