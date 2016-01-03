import {rule, group} from '../typography-fixer'

let ruleset

export default ruleset = createRuleset()

function createRuleset () {
  return group('line-breaks', [
    rule('numberBeforeWord', /(\d)\x20(\D)/, '$1\u00a0$2'),
    rule('shortWords', /\b(\w{1,3})\x20/, '$1\u00a0'),
    rule('lastParagraphWords', /(\w+)\s(\w+\.)$/m, '$1\u00a0$2')
  ])
}
