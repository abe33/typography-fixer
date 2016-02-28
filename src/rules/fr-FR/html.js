import {rule, group} from '../../typography-fixer'
import html from '../html'

/**
 * The ruleset for HTML improvement on french typography
 *
 * It includes rules for:
 *
 * - Wrapping ends of common abbreviation in a `<sup>` tag so that `Mmes`
 *   becomes `M<sup>mes</sup>`
 * - Wrapping ordinal number suffix in a `<sup>` tag
 *
 * Finally, the following rulesets are also included:
 *
 * - {@link src/rules/html.js~html}
 *
 * @type {Array<Object>}
 */
const frFR_HTML = group('fr-FR.html', [
  html,
  rule('abbrWithSuperText', /Mmes|Mme|Mlles|Mlle|Me|Mgr|Dr|cie|Cie|Sté/, (m) => {
    return `${m[0]}<sup>${m.slice(1, m.length)}</sup>`
  }),
  rule('ordinalNumbers', /(\d)(res|re|es|e|èmes)/, '$1<sup class="ord">$2</sup>')
])

export default frFR_HTML
