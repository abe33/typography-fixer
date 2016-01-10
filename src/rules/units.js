import {rule, group} from '../typography-fixer'
import {allUnits, surfaceUnits, volumeUnits} from '../constants'
import lowercase from '../lowercase'

let units

export default units = createRuleset()

function createRuleset () {
  return group('units', [
    group('exponent', [
      rule('surface', `(${surfaceUnits.join('|')})2`, '$1²'),
      rule('volume', `(${volumeUnits.join('|')})3`, '$1³')
    ]),
    rule('unitSpace', `(\\d)\\s*(${allUnits.join('|')})(?=[\\.,\\)\\s]|$)`, '$1\u202f$2'),
    rule('noPeriodAfterUnit', `(${allUnits.join('|')})\\.(\\s[${lowercase.join('')}])`, '$1$2')
  ])
}
