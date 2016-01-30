import {rule, group} from '../../typography-fixer'
import html from '../html'

let enUK_HTML

/**
 * The ruleset for HTML improvement on english typography
 *
 * It includes rules for:
 *
 * - TODO
 *
 * Finally, the following rulesets are also included:
 *
 * - {@link src/rules/html.js~html}
 *
 * @type {Array<Object>}
 */
export default enUK_HTML = createRuleset()

function createRuleset () {
  return group('en-UK.html', [
    html
  ])
}
