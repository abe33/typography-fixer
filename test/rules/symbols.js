import expect from 'expect.js'
import {fix} from '../../src/typography-fixer'
import rules from '../../src/rules/symbols'

const fixString = fix(rules)

describe('symbols ruleset', () => {
  it('replaces (c) with ©', () => {
    expect(fixString('(c)')).to.eql('©')
    expect(fixString('(C)')).to.eql('©')
  })

  it('replaces (r) with ®', () => {
    expect(fixString('(r)')).to.eql('®')
    expect(fixString('(R)')).to.eql('®')
  })

  it('replaces TM with ™', () => {
    expect(fixString('ATM TM')).to.eql('ATM ™')
  })
})
