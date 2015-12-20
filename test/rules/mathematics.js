import expect from 'expect.js'
import {fix} from '../../src/typographic-fixer'
import rules from '../../src/rules/mathematics'

describe('mathematic rules', () => {
  it('replaces 12x21 with 12 \u00D7 21 with non-breaking spaces', () => {
    expect(fix(rules, '12x21')).to.eql('12\u00a0\u00D7\u00a021')
  })

  it('replaces 12 x 21 with 12 \u00D7 21 with non-breaking spaces', () => {
    expect(fix(rules, '12 x 21')).to.eql('12\u00a0\u00D7\u00a021')
  })

  it('replaces 12/21 with 12 ÷ 21 with non-breaking spaces', () => {
    expect(fix(rules, '12/21')).to.eql('12\u00a0÷\u00a021')
  })

  it('replaces 12 / 21 with 12 ÷ 21 with non-breaking spaces', () => {
    expect(fix(rules, '12 / 21')).to.eql('12\u00a0÷\u00a021')
  })
})
