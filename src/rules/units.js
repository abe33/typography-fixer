import {rule, group} from '../typography-fixer'
import {units, surfaceUnits, volumeUnits} from '../constants'

export default group([
  group('exponent', [
    rule('surface', `(${surfaceUnits.join('|')})2`, '$1²'),
    rule('volume', `(${volumeUnits.join('|')})3`, '$1³')
  ]),
  rule('unitSpace', `(\\d)\\s*(${units.join('|')})`, '$1\u202f$2')
])
