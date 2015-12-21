import expect from 'expect.js'
import {fix} from '../../src/typographic-fixer'
import rules from '../../src/rules/mathematics'

describe('mathematic rules', () => {
  it('replaces 12x21 with 12 \u00d7 21 with non-breaking spaces', () => {
    expect(fix(rules, '12x21')).to.eql('12\u00a0\u00d7\u00a021')
  })

  it('replaces 12 x 21 with 12 \u00d7 21 with non-breaking spaces', () => {
    expect(fix(rules, '12 x 21')).to.eql('12\u00a0\u00d7\u00a021')
  })

  it('replaces 1/2 with \u00bd', () => {
    expect(fix(rules, '1/2')).to.eql('\u00bd')
    expect(fix(rules, '1 / 2')).to.eql('\u00bd')
  })

  it('replaces 1/4 with \u00bc', () => {
    expect(fix(rules, '1/4')).to.eql('\u00bc')
    expect(fix(rules, '1 / 4')).to.eql('\u00bc')
  })

  it('replaces 3/4 with \u00be', () => {
    expect(fix(rules, '3/4')).to.eql('\u00be')
    expect(fix(rules, '3 / 4')).to.eql('\u00be')
  })

  it('replaces 12/21 with 12 ÷ 21 with non-breaking spaces', () => {
    expect(fix(rules, '12/21')).to.eql('12\u00a0÷\u00a021')
  })

  it('replaces 12 / 21 with 12 \u00f7 21 with non-breaking spaces', () => {
    expect(fix(rules, '12 / 21')).to.eql('12\u00a0\u00f7\u00a021')
  })

  it('replaces 12-21 with 12 \u2212 21 with non-breaking spaces', () => {
    expect(fix(rules, '12-21')).to.eql('12\u00a0\u2212\u00a021')
  })

  it('replaces 12 - 21 with 12 \u2212 21 with non-breaking spaces', () => {
    expect(fix(rules, '12 - 21')).to.eql('12\u00a0\u2212\u00a021')
  })
})
