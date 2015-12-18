import {rule, group} from './typographic-fixer'

export default group([
  group('spaces', [
    rule('multipleSpaces', /\x20+/, ' '),
    rule('literalNonBreakingSpaces', /\u00a0/, '&nbsp;')
  ])
])
