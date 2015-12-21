import {rule, group} from '../typographic-fixer'
import {currenciesRegExp} from '../constants'

export default group([
  group('punctuations', [
    rule('multiplePunctuation', /([!?])\1+/, '$1'),
    rule('shortEtCaetera', /([Ee]tc)(\.{3}|\u2026)/, '$1.'),
    rule('tripleDots', /\.{3,}/, '\u2026'),
    rule('maleHonorific', /Mr\./, 'M.'),
    rule('numberAbbr', /(n|N)°/, '$1\u00ba'),
    rule('enDash', /(\w\x20)-(\x20\w)/, '$1\u2013$2')
  ]),
  group('quotes', [
    rule('singleQuote', /(\w)'(\w)/, '$1\u2019$2'),
    rule('doubleQuote', /"([^"]+)"/, '\u00ab$1\u00bb')
  ]),
  group('spaces', [
    rule('multipleSpaces', /\x20+/, ' '),
    rule('noSpaceBeforePunctuation', /\s*(,|\.|\)|\u2026|\u2019)/, '$1'),
    rule('noSpaceAfterPunctuation', /(\u2019|\()\s*/, '$1'),
    rule('nonBreakingSpaceBeforePunctuation', /(?:\x20)?([?!:;%])/, '\u202F$1'),
    rule('spaceAfterPunctuation', /([^&\n\s]*)(\.|,|;|:|!|\?|%|\u2026)(?!\x20|$)/, '$1$2 '),
    rule('spaceAfterParenthesis', /(\))(\w)/, '$1 $2'),
    rule('spaceBeforeParenthesis', /(\S)(\()/, '$1 $2'),
    rule('spaceBeforeCurrency', `(\\d)\x20?([${currenciesRegExp}])`, '$1\u00a0$2'),
    rule('spaceAfterLeftQuote', /(\u00ab)\s*(\S)/, '$1\u202F$2'),
    rule('spaceBeforeRightQuote', /(\S)\s*(\u00bb)/, '$1\u202F$2')
  ]),
  group('ordinal', [
    rule('greaterThan10', /(\d{2,})emes/, '$1èmes'),
    rule('firstFemalePlural', /(\d{1})[èe]res/, '$1res'),
    rule('lowerThan10', /((^|[^\d])\d)[èe]mes/, '$1es'),
    rule('firstFemale', /(\d)[èe]re/, '$1re'),
    rule('firstMale', /(\d)[èe]me(?!s)/, '$1e')
  ]),
  group('datetime', [
    rule('daysAndMonths', /(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Aout|Septembre|Octobre|Novembre|Décembre)/, (s) => {
      return s.toLowerCase()
    }),
    rule('timeLong', /(\d)\s*h\s*(\d+)\s*min\s*(\d+)\s*s/, '$1\u00a0h\u00a0$2\u00a0min\u00a0$3\u00a0s'),
    rule('timeShort', /(\d)\s*h\s*(\d)/, '$1\u00a0h\u00a0$2')
  ]),
  group('ligatures', [
    rule('lowerOe', /oe/, '\u0153'),
    rule('upperOe', /O[eE]/, '\u0152'),
    rule('lowerAe', /ae/, '\u00e6'),
    rule('upperAe', /A[eE]/, '\u00c6')
  ])
])
