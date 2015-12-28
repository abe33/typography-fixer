import expect from 'expect.js'
import {units, surfaceUnits, volumeUnits} from '../../src/constants'
import {fix, check} from '../../src/typography-fixer'
import rules from '../../src/rules/units'

describe('units rules', () => {
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

  units.forEach((unit) => {
    it(`replaces 10${unit} with 10\u202f${unit}`, () => {
      expect(fix(rules, `10${unit}`)).to.eql(`10\u202f${unit}`)

      expect(check(rules, `10${unit}`)).to.have.length(1)
      expect(check(rules, `10\u202f${unit}`)).to.be(undefined)
    })

    it(`replaces 10 ${unit} with 10\u202f${unit} with a non-breaking space`, () => {
      expect(fix(rules, `10 ${unit}`)).to.eql(`10\u202f${unit}`)

      expect(check(rules, `10 ${unit}`)).to.have.length(1)
      expect(check(rules, `10\u202f${unit}`)).to.be(undefined)
    })
  })
})
