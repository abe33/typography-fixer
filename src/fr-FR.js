import {rule, group} from './typographic-fixer'

export default group([
  group('punctuations', [
    rule('multiplePunctuation', /([!?])\1+/, '$1'),
    rule('shortEtCaetera', /([Ee]tc)(\.{3}|…|&hellip;)/, '$1.'),
    rule('tripleDots', /\.{3,}/, '&hellip;'),
    rule('maleHonorific', /Mr\./, 'M.'),
    rule('numberAbbr', /(n|N)°/, '$1&#186;')
  ]),
  group('spaces', [
    rule('multipleSpaces', /\x20+/, ' '),
    rule('spaceBeforePunctuation', /(?:\x20|\u00a0)?([!?:%])/, '&nbsp;$1'),
    rule('spaceBeforePunctuation', /(?:^|\x20|\u00a0)([^&\n\s]*)(;)/, '$1&nbsp;$2'),
    rule('literalNonBreakingSpaces', /\u00a0/, '&nbsp;')
  ]),
  group('ordinal', [
    rule('greaterThan10', /(\d{2,})[èe]mes/, '$1<sup>èmes</sup>'),
    rule('firstMalePlural', /(\d{1})ers/, '$1<sup>ers</sup>'),
    rule('firstFemalePlural', /(\d{1})[èe]res/, '$1<sup>res</sup>'),
    rule('lowerThan10', /(\d{1})[èe]mes/, '$1<sup>es</sup>'),
    rule('firstFemale', /(\d)[èe]re/, '$1<sup>re</sup>'),
    rule('firstMale', /(\d)[èe]me/, '$1<sup>e</sup>')
  ])
])