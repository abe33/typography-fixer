import {rule, group} from '../../typography-fixer'

let ruleset

export default ruleset = createRuleset()

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
