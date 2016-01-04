import {rule, group} from '../typography-fixer'

let symbols

export default symbols = createRuleset()

function createRuleset () {
  return group('symbols', [
    rule('copyright', /\([cC]\)/, '©'),
    rule('trademark', /\bTM\b/, '™'),
    rule('registered', /\([rR]\)/, '®')
  ])
}
