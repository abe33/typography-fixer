import {rule, group} from '../typography-fixer'
import {vulgarFractions} from '../constants'

let fractions

export default fractions = createRuleset()

function createRuleset () {
  return group('fractions', vulgarFractions.map(([a,b,char]) => {
    return rule(`${a}On${b}`, `\\b${a}\\s*/\\s*${b}\\b`, char)
  }))
}
