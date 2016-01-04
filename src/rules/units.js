import {rule, group} from '../typography-fixer'
import {allUnits, surfaceUnits, volumeUnits} from '../constants'

let ruleset

export default ruleset = createRuleset()

function createRuleset () {
  return group('units', [
    group('exponent', [
      rule('surface', `(${surfaceUnits.join('|')})2`, '$1²'),
      rule('volume', `(${volumeUnits.join('|')})3`, '$1³')
    ]),
    rule('unitSpace', `(\\d)\\s*(${allUnits.join('|')})(?=[\\.,\\)\\s]|$)`, '$1\u202f$2')
  ])
}
