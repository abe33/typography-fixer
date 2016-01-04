import {rule, group} from '../typography-fixer'
import {fractions} from '../constants'

let ruleset

export default ruleset = createRuleset()

function createRuleset () {
  return group('fractions', fractions.map(([a,b,char]) => {
    return rule(`${a}On${b}`, `\\b${a}\\s*/\\s*${b}\\b`, char)
  }))
}
