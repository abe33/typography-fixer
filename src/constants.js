
export const currencies = {
  '¤': '¤',
  '¥': '¥',
  '£': '£',
  '$': '\\$',
  '\u20a0': '\u20a0',
  '\u20a1': '\u20a1',
  '\u20a2': '\u20a2',
  '\u20a3': '\u20a3',
  '\u20a4': '\u20a4',
  '\u20a5': '\u20a5',
  '\u20a6': '\u20a6',
  '\u20a7': '\u20a7',
  '\u20a8': '\u20a8',
  '\u20a9': '\u20a9',
  '\u20aa': '\u20aa',
  '\u20ab': '\u20ab',
  '\u20ac': '\u20ac',
  '\u20ad': '\u20ad',
  '\u20ae': '\u20ae',
  '\u20af': '\u20af',
  '\u20b0': '\u20b0',
  '\u20b1': '\u20b1',
  '\u20b2': '\u20b2',
  '\u20b3': '\u20b3',
  '\u20b4': '\u20b4',
  '\u20b5': '\u20b5',
  '\u20b6': '\u20b6',
  '\u20b7': '\u20b7',
  '\u20b8': '\u20b8',
  '\u20b9': '\u20b9',
  '\u20ba': '\u20ba',
  '\u20bb': '\u20bb',
  '\u20bc': '\u20bc',
  '\u20bd': '\u20bd',
  '\u20be': '\u20be'
}

export const currenciesRegExp = Object.keys(currencies).map((c) => {
  return currencies[c]
}).join('')

export const fractions = [
  [1, 4, '\u00bc'],
  [1, 2, '\u00bd'],
  [3, 4, '\u00be'],
  [1, 7, '\u2150'],
  [1, 9, '\u2151'],
  [1, 10, '\u2152'],
  [1, 3, '\u2153'],
  [2, 3, '\u2154'],
  [1, 5, '\u2155'],
  [2, 5, '\u2156'],
  [3, 5, '\u2157'],
  [4, 5, '\u2158'],
  [1, 6, '\u2159'],
  [5, 6, '\u215a'],
  [1, 8, '\u215b'],
  [3, 8, '\u215c'],
  [5, 8, '\u215d'],
  [7, 8, '\u215e'],
  [0, 3, '\u2189']
]

export const unitScales = [
  'y',
  'z',
  'a',
  'f',
  'p',
  'n',
  'µ',
  'm',
  'c',
  'd',
  '',
  'da',
  'h',
  'k',
  'M',
  'G',
  'T',
  'P',
  'E',
  'Z',
  'Y'
]

export const scalableUnits = [
  'm',
  'm²',
  'm³',
  'g',
  's',
  'l',
  'L',
  'B',
  'K',
  'W',
  'V',
  'Hz',
  'Ω',
  'A',
  'mol',
  'cd'
]

export const surfaceUnits = [
  'mile',
  'in',
  'yd',
  'ft',
  'm'
]

export const volumeUnits = [
  'in',
  'yd',
  'ft',
  'm'
]

export const otherUnits = [
  // temperatures
  '°C',
  '°F',
  '°Ré',
  '°N',
  '°Ra',
  // distances
  'mi',
  'in',
  'ft',
  'yd',
  'nautical mile',
  // speed
  'kmph',
  'km/h',
  'mps',
  'm/s',
  'mph',
  'mi/h',
  'knot',
  'nautical mile/h',
  'ma',
  // surfaces
  'ha',
  'a',
  'ca',
  'mile²',
  'in²',
  'yd²',
  'ft²',
  'ro',
  'acre',
  'nautical mile²',
  // volumes
  'in³',
  'ft³',
  'yd³',
  'gal',
  'bbl',
  'pt',
  'fluid pt',
  'dry pt',
  // weight
  't',
  'carat',
  'grain',
  'oz',
  'lb',
  'cwt',
  'ton',
  'st',
  // data
  'b',
  // time
  'h',
  'min',
  // electric
  'dBm',
  'dBW',
  'var',
  'VA',
  'F',
  'H',
  'S',
  'C',
  'Ah',
  'J',
  'kWh',
  'eV',
  'Ω∙m',
  'S/m',
  'V/m',
  'N/C',
  'V·m',
  'T',
  'G',
  'Wb',
  'dB',
  'ppm'
]

function combine (a, b) {
  return a
  .map((u) => { return b.map((s) => { return `${s}${u}` }) })
  .reduce((memo, el) => { return memo.concat(el) }, [])
}

export const units = otherUnits.concat(combine(scalableUnits, unitScales))
