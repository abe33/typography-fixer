import expect from 'expect.js';
import {fix} from '../../src/typography-fixer';
import rules from '../../src/rules/fractions';
import {vulgarFractions} from '../../src/constants';

const fixString = fix(rules);

describe('fractions ruleset', () => {
  vulgarFractions.forEach(([a, b, expected]) => {
    it(`replaces ${a}/${b} with ${expected}`, () => {
      expect(fixString(`${a}/${b}`)).to.eql(expected);
      expect(fixString(`${a} / ${b}`)).to.eql(expected);
    });
  });
});
