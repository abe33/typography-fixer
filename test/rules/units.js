import expect from 'expect.js';
import {allUnits, surfaceUnits, volumeUnits} from '../../src/constants';
import {fix, check} from '../../src/typography-fixer';
import rules from '../../src/rules/units';

const fixString = fix(rules);
const checkString = check(rules);

describe('units ruleset', () => {
  surfaceUnits.forEach((unit) => {
    it(`replaces ${unit}2 by ${unit}²`, () => {
      expect(fixString(`${unit}2`)).to.eql(`${unit}²`);

      expect(checkString(`${unit}2`)).to.have.length(1);
      expect(checkString(`${unit}²`)).to.be(undefined);
    });
  });

  volumeUnits.forEach((unit) => {
    it(`replaces ${unit}3 by ${unit}³`, () => {
      expect(fixString(`${unit}3`)).to.eql(`${unit}³`);

      expect(checkString(`${unit}3`)).to.have.length(1);
      expect(checkString(`${unit}³`)).to.be(undefined);
    });
  });

  allUnits.forEach((unit) => {
    it(`adds a thin non-breaking space between a number and ${unit}`, () => {
      expect(fixString(`10${unit}`)).to.eql(`10\u202f${unit}`);
      expect(fixString(`10 ${unit}`)).to.eql(`10\u202f${unit}`);
      expect(fixString(`10 ${unit}, foo`)).to.eql(`10\u202f${unit}, foo`);
      expect(fixString(`10 ${unit}.`)).to.eql(`10\u202f${unit}.`);
      expect(fixString(`10 ${unit} bar`)).to.eql(`10\u202f${unit} bar`);
      expect(fixString(`(10 ${unit})`)).to.eql(`(10\u202f${unit})`);
      expect(fixString(`10 ${unit}foo`)).to.eql(`10 ${unit}foo`);

      expect(checkString(`10${unit}`)).to.have.length(1);
      expect(checkString(`10\u202f${unit}`)).to.be(undefined);
      expect(checkString(`10 ${unit}foo`)).to.be(undefined);

      expect(checkString(`10 ${unit}`)).to.have.length(1);
      expect(checkString(`10\u202f${unit}`)).to.be(undefined);
    });

    it(`removes a period after ${unit} if not at the end of a sentence`, () => {
      expect(fixString(`10\u202f${unit}.`)).to.eql(`10\u202f${unit}.`);
      expect(fixString(`10\u202f${unit}. Foo`)).to.eql(`10\u202f${unit}. Foo`);
      expect(fixString(`10\u202f${unit}. Émile`)).to.eql(`10\u202f${unit}. Émile`);
      expect(fixString(`10\u202f${unit}. foo`)).to.eql(`10\u202f${unit} foo`);

      expect(checkString(`10\u202f${unit}.`)).to.be(undefined);
      expect(checkString(`10\u202f${unit}. Foo`)).to.be(undefined);
      expect(checkString(`10\u202f${unit}. Émile`)).to.be(undefined);
      expect(checkString(`10\u202f${unit}. foo`)).to.have.length(1);
    });
  });
});
