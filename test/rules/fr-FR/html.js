import expect from 'expect.js';
import {fix, check} from '../../../src/typography-fixer';
import rules from '../../../src/rules/fr-FR/html';

const fixString = fix(rules);
const checkString = check(rules);

describe('fr-FR html rules', () => {
  it('includes common rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('html.common') >= 0;
    })).to.be(true);
  });

  const abbrWithSuperText = [
    ['Mme', 'M<sup>me</sup>'],
    ['Mmes', 'M<sup>mes</sup>'],
    ['Mlle', 'M<sup>lle</sup>'],
    ['Mlles', 'M<sup>lles</sup>'],
    ['Me', 'M<sup>e</sup>'],
    ['Mgr', 'M<sup>gr</sup>'],
    ['Dr', 'D<sup>r</sup>'],
    ['cie', 'c<sup>ie</sup>'],
    ['Cie', 'C<sup>ie</sup>'],
    ['Sté', 'S<sup>té</sup>'],
  ];
  abbrWithSuperText.forEach(([source, expected]) => {
    it(`replaces ${source} with ${expected}`, () => {
      expect(fixString(source)).to.eql(expected);

      expect(checkString(source)).to.have.length(1);
      expect(checkString(expected)).to.be(undefined);
    });
  });

  const ordinalNumbers = [
    ['1re', '1<sup class="ord">re</sup>'],
    ['1re', '1<sup class="ord">re</sup>'],
    ['2e', '2<sup class="ord">e</sup>'],
    ['2e', '2<sup class="ord">e</sup>'],
    ['3e', '3<sup class="ord">e</sup>'],
    ['3e', '3<sup class="ord">e</sup>'],
    ['10e', '10<sup class="ord">e</sup>'],
    ['1res', '1<sup class="ord">res</sup>'],
    ['1res', '1<sup class="ord">res</sup>'],
    ['2es', '2<sup class="ord">es</sup>'],
    ['2es', '2<sup class="ord">es</sup>'],
    ['10èmes', '10<sup class="ord">èmes</sup>'],
  ];
  ordinalNumbers.forEach(([source, expected]) => {
    it(`replaces ${source} with ${expected}`, () => {
      expect(fixString(source)).to.eql(expected);

      expect(checkString(source)).to.have.length(1);
      expect(checkString(expected)).to.be(undefined);
    });
  });
});
