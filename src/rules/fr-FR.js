import {rule, group} from '../typography-fixer'
import {currenciesRegExp} from '../constants'

export default group([
  group('punctuations', [
    rule('collapseMultiplePunctuation', /([!?])\1+/, '$1'),
    rule('shortEtCaetera', /([Ee]tc)(\.{3}|\u2026)/, '$1.'),
    rule('tripleDots', /\.{3,}/, '\u2026'),
    rule('maleHonorific', /Mr\.?/, 'M.'),
    rule('possessiveInterrogative', /a-t'il/, 'a-t-il'),
    rule('cad', /c\.?-?[aà]-?d\.?/, 'c.-à-d.'),
    rule('numberAbbr', /(n|N)°/, '$1\u00ba'),
    rule('enDashBetweenWords', /(\D\x20)-(\x20\D)/, '$1\u2013$2'),
    rule('enDashBetweenNumbers', /(\d)\s*-\s*(\d)/, '$1\u2013$2')
  ]),
  group('quotes', [
    rule('singleQuote', /(\w)'(\w)/, '$1\u2019$2'),
    rule('doubleQuote', /"([^"]+)"/, '\u00ab$1\u00bb')
  ]),
  group('spaces', [
    rule('collapseMultipleSpaces', /\x20{2,}/, ' '),
    rule('noSpaceBeforePunctuation', /\s+(,|\.|\)|\u2026|\u2019)/, '$1'),
    rule('noSpaceAfterPunctuation', /(\u2019|\()\s+/, '$1'),
    rule('noSpaceAroundEnDashBetweenNumbers', /(\d)\s*\u2013\s*(\d)/, '$1\u2013$2'),
    rule('nonBreakingSpaceBeforePunctuation', /(\S)(?:\x20)?([?!;%])/, '$1\u202F$2'),
    rule('nonBreakingSpaceBeforeColon', /([^\d\s])(?:\x20)?(:)/, '$1\u202F$2'),
    rule('spaceAfterPunctuation', /(;|!|\?|%|\u2026)(\S)/, '$1 $2'),
    rule('spaceAfterPeriod', /(\.)([^\s-])/, '$1 $2'),
    rule('spaceAfterColon', /(\D\s?)(:)(\S)/, '$1$2 $3'),
    rule('spaceAfterComma', /(\D)(,)(\S)/, '$1$2 $3'),
    rule('spaceAfterParenthesis', /(\))(\w)/, '$1 $2'),
    rule('spaceBeforeParenthesis', /(\S)(\()/, '$1 $2'),
    rule('spaceBeforeCurrency', `(\\d)\x20?([${currenciesRegExp}])`, '$1\u00a0$2'),
    rule('spaceAroundEnDash', /([^\d\s])\x20*(\u2013)\x20*(\D)/, '$1\u00a0$2 $3'),
    rule('spaceAfterLeftQuote', /(\u00ab)\x20*(\S)/, '$1\u202F$2'),
    rule('spaceBeforeRightQuote', /(\S)\x20*(\u00bb)/, '$1\u202F$2'),
    rule('nonBreakingSpaceAfterHonorific', /(M\.|Mme|Mlle)\x20([A-Z])/, '$1\u00a0$2')
  ]),
  group('ordinal', [
    rule('greaterThan10', /(\d{2,})emes\b/, '$1èmes'),
    rule('firstFemalePlural', /(\d{1})[èe]res\b/, '$1res'),
    rule('lowerThan10', /((^|[^\d])\d)[èe]mes\b/, '$1es'),
    rule('firstFemale', /(\d)[èe]re\b/, '$1re'),
    rule('firstMale', /(\d)[èe]me(?!s)\b/, '$1e')
  ]),
  group('datetime', [
    rule('daysAndMonths', /(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Aout|Septembre|Octobre|Novembre|Décembre)/, (s) => {
      return s.toLowerCase()
    }),
    rule('time', /(\d+)\x20*(h)\x20*(\d+)(?:\x20*(m(?:in)?)(?:\x20*(\d+)\x20*(s(?:ec)?))?)?/, (m, ...args) => {
      args.pop()
      args.pop()

      args = args.filter((v) => { return v })

      return args.join('\u00a0')
    })
  ]),
  group('ligatures', [
    rule('lowerOe', /oe/, '\u0153'),
    rule('upperOe', /O[eE]/, '\u0152'),
    rule('lowerAe', /ae/, '\u00e6'),
    rule('upperAe', /A[eE]/, '\u00c6')
  ])
])
