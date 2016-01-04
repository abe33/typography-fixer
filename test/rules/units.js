import expect from 'expect.js'
import {allUnits, surfaceUnits, volumeUnits} from '../../src/constants'
import {fix, check} from '../../src/typography-fixer'
import rules from '../../src/rules/units'

describe('units ruleset', () => {
  surfaceUnits.forEach((unit) => {
    it(`replaces ${unit}2 by ${unit}²`, () => {
      expect(fix(rules, `${unit}2`)).to.eql(`${unit}²`)

      expect(check(rules, `${unit}2`)).to.have.length(1)
      expect(check(rules, `${unit}²`)).to.be(undefined)
    })
  })

  volumeUnits.forEach((unit) => {
    it(`replaces ${unit}3 by ${unit}³`, () => {
      expect(fix(rules, `${unit}3`)).to.eql(`${unit}³`)

      expect(check(rules, `${unit}3`)).to.have.length(1)
      expect(check(rules, `${unit}³`)).to.be(undefined)
    })
  })

  allUnits.forEach((unit) => {
    it(`adds a thin non-breaking space between a number and ${unit}`, () => {
      expect(fix(rules, `10${unit}`)).to.eql(`10\u202f${unit}`)
      expect(fix(rules, `10 ${unit}`)).to.eql(`10\u202f${unit}`)
      expect(fix(rules, `10 ${unit}, foo`)).to.eql(`10\u202f${unit}, foo`)
      expect(fix(rules, `10 ${unit}.`)).to.eql(`10\u202f${unit}.`)
      expect(fix(rules, `10 ${unit} bar`)).to.eql(`10\u202f${unit} bar`)
      expect(fix(rules, `(10 ${unit})`)).to.eql(`(10\u202f${unit})`)
      expect(fix(rules, `10 ${unit}foo`)).to.eql(`10 ${unit}foo`)

      expect(check(rules, `10${unit}`)).to.have.length(1)
      expect(check(rules, `10\u202f${unit}`)).to.be(undefined)
      expect(check(rules, `10 ${unit}foo`)).to.be(undefined)

      expect(check(rules, `10 ${unit}`)).to.have.length(1)
      expect(check(rules, `10\u202f${unit}`)).to.be(undefined)
    })
  })
})
