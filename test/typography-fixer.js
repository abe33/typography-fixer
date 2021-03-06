import expect from 'expect.js';
import {rule, ignore, group, check, fix} from '../src/typography-fixer';

describe('typographyFixer', () => {
  describe('check()', () => {
    it('returns a curried function when called with a single argument', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar',
      };

      expect(check()).to.be.a(Function);
      expect(check([])).to.be.a(Function);
      expect(check([ruleObject])).to.be.a(Function);
    });

    it('ignores malformed rules', () => {
      const rules = [
        {name: 'string'},
        {name: 'string', match: 'string'},
        {name: 'string', replace: 'bar'},
        {match: 'string', replace: 'bar'},
        {ignore: 'string'},
      ];

      expect(check(rules, 'string')).to.be(undefined);
    });

    it('returns undefined when called without any rules', () => {
      expect(check([], 'string')).to.be(undefined);
      expect(check([])('string')).to.be(undefined);
    });

    it('returns undefined when there is no match in the string', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar',
      };
      expect(check([ruleObject], 'string')).to.be(undefined);
    });

    it('returns a report object for each match', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar',
      };
      const reports = check([ruleObject], 'Da foo foo');

      expect(reports).to.eql([
        {rule: 'Foo', range: [3, 6]},
        {rule: 'Foo', range: [7, 10]},
      ]);
    });

    describe('with ignore rules', () => {
      it('applies the rules unless in excluded ranges', () => {
        const ruleObject = {
          name: 'Foo',
          match: /foo/,
          replace: 'bar',
        };
        const ignoreObject = {
          name: 'quotes',
          ignore: /"[^"]+"/,
        };
        const reports = check([ruleObject, ignoreObject], 'foo "foo" foo "foo"');

        expect(reports).to.eql([
          {rule: 'Foo', range: [0, 3]},
          {rule: 'Foo', range: [10, 13]},
        ]);
      });

      describe('that is inverted', () => {
        it('applies the rules unless in excluded ranges', () => {
          const ruleObject = {
            name: 'Foo',
            match: /foo/,
            replace: 'bar',
          };
          const ignoreObject = {
            name: 'quotes',
            ignore: /"[^"]+"/,
            invertRanges: true,
          };
          const reports = check([ruleObject, ignoreObject], 'foo "foo" foo "foo"');

          expect(reports).to.eql([
            {rule: 'Foo', range: [5, 8]},
            {rule: 'Foo', range: [15, 18]},
          ]);
        });
      });
    });
  });

  describe('fix()', () => {
    it('returns a curried function when called with a single argument', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar',
      };

      expect(fix()).to.be.a(Function);
      expect(fix([])).to.be.a(Function);
      expect(fix([ruleObject])).to.be.a(Function);
    });

    it('ignores malformed rules', () => {
      const rules = [
        {name: 'string'},
        {name: 'string', match: 'string'},
        {name: 'string', replace: 'bar'},
        {match: 'string', replace: 'bar'},
        {ignore: 'string'},
      ];

      expect(fix(rules, 'string')).to.eql('string');
    });

    it('returns the string when called without any rules', () => {
      expect(fix([], 'string')).to.eql('string');
      expect(fix([])('string')).to.eql('string');
    });

    it('returns the string when there is no match', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar',
      };

      expect(fix([ruleObject], 'string')).to.eql('string');
    });

    it('replaces instances of matches by the replacement string', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar',
      };

      expect(fix([ruleObject], 'Da foo foo')).to.eql('Da bar bar');
    });

    it('applies the rules in order', () => {
      const ruleObject1 = rule('Foo', /foo/, 'bar');
      const ruleObject2 = rule('Foo', /foo/, 'baz');

      expect(fix([ruleObject1, ruleObject2], 'Da foo foo')).to.eql('Da bar bar');
    });

    describe('with ignore rules', () => {
      it('applies the rules unless in excluded ranges', () => {
        const ruleObject = {
          name: 'Foo',
          match: /foo|"/,
          replace: 'bar',
        };
        const ignoreObject = {
          name: 'quotes',
          ignore: /"[^"]+"/,
        };

        expect(fix([ruleObject, ignoreObject], 'foo "foo" foo "foo"')).to.eql('bar "foo" bar "foo"');
      });

      describe('that is inverted', () => {
        it('applies the rules unless in excluded ranges', () => {
          const ruleObject = {
            name: 'Foo',
            match: /foo|"/,
            replace: 'bar',
          };
          const ignoreObject = {
            name: 'quotes',
            ignore: /"[^"]+"/,
            invertRanges: true,
          };

          expect(fix([ruleObject, ignoreObject], 'foo "foo" foo "foo"')).to.eql('foo barbarbar foo barbarbar');
        });
      });
    });
  });

  describe('group()', () => {
    let ruleObject, ignoreObject;

    beforeEach(() => {
      ruleObject = rule('Foo', /foo/, 'bar');
      ignoreObject = ignore('Bar', /bar/);
    });

    it('returns an array with the provided rules with a namespaced name', () => {
      const rules = group('bar', [ruleObject, ignoreObject]);

      expect(rules).to.be.an(Array);
      expect(rules).to.have.length(2);
      expect(rules[0].name).to.eql('bar.Foo');
      expect(rules[0].match).to.eql(ruleObject.match);
      expect(rules[0].replace).to.eql(ruleObject.replace);

      expect(rules[1].name).to.eql('bar.Bar');
      expect(rules[1].ignore).to.eql(ignoreObject.ignore);
    });

    if (parseFloat(process.version.slice(1)) >= 0.12) {
      it('returns a frozen array', () => {
        const rules = group('bar', [ruleObject, ignoreObject]);

        expect(() => {
          rules.push(rule('bar', /bar/, 'baz'));
        }).to.throwError();
      });
    } else {
      it('returns a frozen array', () => {
        const rules = group('bar', [ruleObject, ignoreObject]);

        rules.push(rule('bar', /bar/, 'baz'));

        expect(rules).to.have.length(2);
      });
    }

    it('flatten rules coming from nested groups', () => {
      const rules = group('bar', [
        group('baz', [
          group('bat', [ruleObject]),
        ]),
      ]);

      expect(rules).to.be.an(Array);
      expect(rules).to.have.length(1);
      expect(rules[0].name).to.eql('bar.baz.bat.Foo');
    });

    describe('without a name', () => {
      it('flatten rules coming from nested groups without changing their name', () => {
        const rules = group([
          group('baz', [
            group('bat', [ruleObject]),
          ]),
        ]);

        expect(rules).to.be.an(Array);
        expect(rules).to.have.length(1);
        expect(rules[0].name).to.eql('baz.bat.Foo');
      });
    });

    describe('with an invalid type/structure', () => {
      it('treats it as an empty structure', () => {
        const rules = group(false, 'foo');

        expect(rules).to.eql([]);
      });
    });
  });

  describe('rule()', () => {
    it('returns a frozen object representing a rule', () => {
      const ruleObject = rule('foo', /foo/, 'bar');
      expect(() => {
        ruleObject.name = 'baz';
      }).to.throwError();
    });
  });

  describe('ignore()', () => {
    it('returns a frozen object representing a ignore rule', () => {
      const ignoreObject = ignore('foo', /foo/, true);
      expect(() => {
        ignoreObject.name = 'baz';
      }).to.throwError();
    });

    it('defaults invertRanges to false', () => {
      const ignoreObject = ignore('foo', /foo/);
      expect(ignoreObject.invertRanges).not.to.be.ok();
    });
  });
});
