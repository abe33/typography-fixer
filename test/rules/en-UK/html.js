import expect from 'expect.js'
import {fix, check} from '../../../src/typography-fixer'
import rules from '../../../src/rules/en-UK/html'

const fixString = fix(rules)
const checkString = check(rules)

describe('en-UK html rules', () => {
  it('includes fraction rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('html.common') >= 0
    })).to.be(true)
  })
})
