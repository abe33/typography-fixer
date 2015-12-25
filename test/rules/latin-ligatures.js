import expect from 'expect.js'
import {fix, check} from '../../src/typography-fixer'
import rules from '../../src/rules/latin-ligatures'

describe('ligature rules', () => {
  it('replaces ff with \ufb00', () => {
    expect(fix(rules, 'effect')).to.eql('e\ufb00ect')
  })

  it('replaces fi with \ufb01', () => {
    expect(fix(rules, 'fit')).to.eql('\ufb01t')
  })

  it('replaces fl with \ufb02', () => {
    expect(fix(rules, 'flash')).to.eql('\ufb02ash')
  })

  it('replaces ffi with \ufb03', () => {
    expect(fix(rules, 'suffix')).to.eql('su\ufb03x')
  })

  it('replaces ffl with \ufb04', () => {
    expect(fix(rules, 'shuffle')).to.eql('shu\ufb04e')
  })

  it('replaces ft with \ufb05', () => {
    expect(fix(rules, 'shaft')).to.eql('sha\ufb05')
  })

  it('replaces st with \ufb06', () => {
    expect(fix(rules, 'start')).to.eql('\ufb06art')
  })
})
