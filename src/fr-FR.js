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
  ])
])
