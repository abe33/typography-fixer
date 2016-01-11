import {rule, group} from '../../typography-fixer'

let frFR_HTML

/**
 * The ruleset for HTML improvement on french typography
 *
 * It includes rules for:
 *
 * - Wrapping ends of common abbreviation in a `<sup>` tag so that `Mmes`
 *   becomes `M<sup>mes</sup>`
 * - Wrapping ordinal number suffix in a `<sup>` tag
 * - Wrapping double quotes in quotation marks in a span with the `dquo` class
 * - Wrapping ampersand in a span with the `amp` class
 * - Wrapping many consecutive capitals in a span with the `caps` class
 *
 * @type {Array<Object>}
 */
export default frFR_HTML = createRuleset()

function createRuleset () {
  return group('fr-FR.html', [
    rule('abbrWithSuperText', /Mmes|Mme|Mlles|Mlle|Me|Mgr|Dr|cie|Cie|Sté/, (m) => {
      return `${m[0]}<sup>${m.slice(1, m.length)}</sup>`
    }),
    rule('ordinalNumbers', /(\d)(res|re|es|e|èmes)/, '$1<sup class="ord">$2</sup>'),
    rule('quotes', /(\u00ab|\u00bb)/, '<span class="dquo">$1</span>'),
    rule('ampersand', /(&amp;|&)($|\s)/, '<span class="amp">$1</span>$2'),
    rule('caps', /(([A-Z]\.?){2,})/, '<span class="caps">$1</span>')
  ])
}
