import expect from 'expect.js'
import {fix} from '../../src/typographic-fixer'
import rules from '../../src/rules/symbols'

describe('symbols rules', () => {
  it('replaces (c) with ©', () => {
    expect(fix(rules, '(c)')).to.eql('©')
    expect(fix(rules, '(C)')).to.eql('©')
  })

  it('replaces TM with ™', () => {
    expect(fix(rules, 'ATM TM')).to.eql('ATM ™')
  })
})
