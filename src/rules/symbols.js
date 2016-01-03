import {rule, group} from '../typography-fixer'

let ruleset

export default ruleset = createRuleset()

function createRuleset () {
  return group('symbols', [
    rule('copyright', /\([cC]\)/, '©'),
    rule('trademark', /\bTM\b/, '™'),
    rule('registered', /\([rR]\)/, '®')
  ])
}
