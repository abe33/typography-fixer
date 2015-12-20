import {rule, group} from '../typographic-fixer'

export default group([
  group('punctuations', [
    rule('multiplePunctuation', /([!?])\1+/, '$1'),
    rule('shortEtCaetera', /([Ee]tc)(\.{3}|\u2026)/, '$1.'),
    rule('tripleDots', /\.{3,}/, '\u2026'),
    rule('maleHonorific', /Mr\./, 'M.'),
    rule('numberAbbr', /(n|N)°/, '$1\u00ba')
  ]),
  group('spaces', [
    rule('multipleSpaces', /\x20+/, ' '),
    rule('spaceAfterPunctuation', /([^&\n\s]*)(\.|,|;|:|!|\?|%|\.{3}|\u2026)(?!\x20|$)/, '$1$2 '),
    rule('spaceBeforePunctuation', /(?:\x20|\u00a0)?([?%])/, '\u00a0$1'),
    rule('spaceBeforeColon', /(?:\x20|\u00a0)?(:)(?!\/\/)/, '\u00a0$1'),
    rule('spaceBeforeBang', /(?:\x20|\u00a0)?(!)(?!\[)/, '\u00a0$1'),
    rule('spaceBeforeSemiColon', /(?:^|\x20|\u00a0)([^&\n\s]*)(;)/, '$1\u00a0$2')
  ]),
  group('ordinal', [
    rule('greaterThan10', /(\d{2,})emes/, '$1èmes'),
    rule('firstFemalePlural', /(\d{1})[èe]res/, '$1res'),
    rule('lowerThan10', /((^|[^\d])\d)[èe]mes/, '$1es'),
    rule('firstFemale', /(\d)[èe]re/, '$1re'),
    rule('firstMale', /(\d)[èe]me(?!s)/, '$1e')
  ]),
  group('quotes', [
    rule('singleQuote', /(\w)'(\w)/, '$1\u2019$2'),
    rule('doubleQuote', /"\s*([^"]+)"/, (_, m) => {
      return `\u00ab\u00a0${m.replace(/\s+$/, '')}\u00a0\u00bb`
    })
  ]),
  group('datetime', [
    rule('daysAndMonths', /(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Aout|Septembre|Octobre|Novembre|Décembre)/, (s) => {
      return s.toLowerCase()
    }),
    rule('timeLong', /(\d)\s*h\s*(\d+)\s*min\s*(\d+)\s*s/, '$1\u00a0h\u00a0$2\u00a0min\u00a0$3\u00a0s'),
    rule('timeShort', /(\d)\s*h\s*(\d)/, '$1\u00a0h\u00a0$2')
  ])
])
