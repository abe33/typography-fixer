import {rule, group} from '../typography-fixer'
import {allUnits, surfaceUnits, volumeUnits} from '../constants'
import lowercase from '../lowercase'

let units

/**
 * The ruleset for measurement units formatting.
 *
 * The following units from the international units system are supported: `m`,
 * `m²`, `m³`, `g`, `s`, `l`, `L`, `K`, `W`, `V`, `Hz`, `Ω`, `A`, `mol`
 * and `cd`.
 *
 * All these units have derivations using the following prefixes: `y`, `z`, `a`,
 * `f`, `p`, `n`, `µ`, `m`, `c`, `d`, `da`, `h`, `k`, `M`, `G`, `T`, `P`, `E`,
 * `Z` and `Y`.
 *
 * Additionally, the following units are supported:
 *
 * - temperature: `°C`, `°F`, `°Ré`, `°N`, `°Ra`
 * - distance: `mi`, `in`, `ft`, `yd`, `nautical mile`
 * - speed: `kmph`, `km/h`, `mps`, `m/s`, `mph`, `mi/h`, `knot`,
 *   `nautical mile/h`, `ma`
 * - surface: `ha`, `a`, `ca`, `mile²`, `in²`, `yd²`, `ft²`, `ro`, `acre`,
 *   `nautical mile²`
 * - volume: `in³`, `ft³`, `yd³`, `gal`, `bbl`, `pt`, `fluid pt`, `dry pt`
 * - weight: `t`, `carat`, `grain`, `oz`, `lb`, `cwt`, `ton`, `st`
 * - data: `b`, `B`, and all the derivations using the international system
 *   prefixes
 * - time: `h`, `min`
 * - electric: `dBm`, `dBW`, `var`, `VA`, `F`, `H`, `S`, `C`, `Ah`, `J`, `kWh`,
 *   `eV`, `Ω∙m`, `S/m`, `V/m`, `N/C`, `V·m`, `T`, `G`, `Wb`, `dB`, `ppm`
 *
 * This ruleset includes rules for:
 *
 * - Replacing a `2` after a surface unit with `²`
 * - Replacing a `3` after a volumic unit with `³`
 * - Adding a non-breaking space between a number and the following unit
 * - Removing a period placed after the unit when it's not the end of a sentence
 *
 * @type {Array<Object>}
 * @see https://en.wikipedia.org/wiki/International_System_of_Units
 * @see http://physics.nist.gov/cuu/Units/checklist.html
 */
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
