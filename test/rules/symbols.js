import expect from 'expect.js'
import {fix} from '../../src/typography-fixer'
import rules from '../../src/rules/symbols'

describe('symbols rules', () => {
  it('replaces (c) with ©', () => {
    expect(fix(rules, '(c)')).to.eql('©')
    expect(fix(rules, '(C)')).to.eql('©')
  })

  it('replaces (r) with ®', () => {
    expect(fix(rules, '(r)')).to.eql('®')
    expect(fix(rules, '(R)')).to.eql('®')
  })

  it('replaces TM with ™', () => {
    expect(fix(rules, 'ATM TM')).to.eql('ATM ™')
  })
})
