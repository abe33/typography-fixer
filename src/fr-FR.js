import {rule, group} from './typographic-fixer'

export default group([
  group('spaces', [
    rule('multipleSpaces', /\x20+/, ' '),
    rule('spaceBeforePunctuation', /(?:\x20|\u00a0)?([!?:%])/, '&nbsp;$1'),
    rule('spaceBeforePunctuation', /(?:^|\x20|\u00a0)([^&\n\s]*)(;)/, '$1&nbsp;$2'),
    rule('literalNonBreakingSpaces', /\u00a0/, '&nbsp;')
  ])
])
