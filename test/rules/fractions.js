import expect from 'expect.js'
import {fix} from '../../src/typography-fixer'
import rules from '../../src/rules/fractions'
import {vulgarFractions} from '../../src/constants'

describe('fractions ruleset', () => {
  vulgarFractions.forEach(([a,b,expected]) => {
    it(`replaces ${a}/${b} with ${expected}`, () => {
      expect(fix(rules, `${a}/${b}`)).to.eql(expected)
      expect(fix(rules, `${a} / ${b}`)).to.eql(expected)
    })
  })
})
