import {rule, group} from '../typographic-fixer'
import {currencies} from '../constants'

export default group([
  group('punctuations', [
    rule('multiplePunctuation', /([!?])\1+/, '$1'),
    rule('shortEtCaetera', /([Ee]tc)(\.{3}|\u2026)/, '$1.'),
    rule('tripleDots', /\.{3,}/, '\u2026')
  ]),
  group('quotes', [
    rule('singlePrime', /(\d)'/, '$1\u2032'),
    rule('doublePrime', /(\d)"/, '$1\u2033'),
    rule('singleQuote', /(\w)'(\w)/, '$1\u2019$2'),
    rule('doubleQuote', /"([^"]+)"/, '\u201c$1\u201d'),
    rule('punctuationAfterQuote', /(\u201d)(\.|,)/, '$2$1')
  ]),
  group('spaces', [
    rule('multipleSpaces', /\x20+/, ' '),
    rule('noSpaceBeforePunctuation', /(\x20|\u00a0)*(\.|,|;|:|!|\?|%|\)|\u2019|\u2026)/, '$2'),
    rule('noSpaceAfterPunctuation', /(\u2019|\()\s*/, '$1'),
    rule('spaceAfterPunctuation', /(,|;|!|\?|%|\u2026)(?!\x20|$)/, '$1 '),
    rule('spaceAfterPunctuation', /(\D)(\.)(?!\x20|$)/, '$1$2 '),
    rule('spaceAfterColon', /(\D)(:)(?!\x20|$)/, '$1$2 '),
    rule('noSpaceAroundEmDash', /(\x20|\u00a0)*(\u2014)(\x20|\u00a0)*/, '$2'),
    rule('spaceAroundEnDash', /\s*(\u2013)\s*/, '\u00a0$1 '),
    rule('noSpaceAfterLeftQuote', /(\u201c)\s*(\S)/, '$1$2'),
    rule('noSpaceBeforeRightQuote', /(\S)\s*(\u201d)/, '$1$2'),
    rule('spaceAfterParenthesis', /(\))(\w)/, '$1 $2'),
    rule('spaceBeforeParenthesis', /(\S)(\()/, '$1 $2'),
    rule('nonBreakingSpaceAfterHonorific', /(Mr|Ms|Miss)\s([A-Z])/, '$1\u00a0$2')
  ])
])
