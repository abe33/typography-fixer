import expect from 'expect.js'
import {fix} from '../../src/typography-fixer'
import rules from '../../src/rules/mathematics'
import {fractions} from '../../src/constants'

describe('mathematic rules', () => {
  fractions.forEach(([a,b,expected]) => {
    it(`replaces ${a}/${b} with ${expected}`, () => {
      expect(fix(rules, `${a}/${b}`)).to.eql(expected)
      expect(fix(rules, `${a} / ${b}`)).to.eql(expected)
    })
  })

  it('replaces 12x21 with 12 \u00d7 21 with non-breaking spaces', () => {
    expect(fix(rules, '12x21')).to.eql('12\u00a0\u00d7\u00a021')
  })

  it('replaces 12 x 21 with 12 \u00d7 21 with non-breaking spaces', () => {
    expect(fix(rules, '12 x 21')).to.eql('12\u00a0\u00d7\u00a021')
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

  it('replaces 12+21 with 12 + 21 with non-breaking spaces', () => {
    expect(fix(rules, '12+21')).to.eql('12\u00a0+\u00a021')
  })

  it('replaces 12 + 21 with 12 + 21 with non-breaking spaces', () => {
    expect(fix(rules, '12 + 21')).to.eql('12\u00a0+\u00a021')
  })
})
