import expect from 'expect.js'
import {rule, ignore, group, check, fix} from '../src/typography-fixer'

describe('typographyFixer', () => {
  describe.only('check', () => {
    it('returns a curried function when called with a single argument', () => {
      expect(check([])).to.be.a(Function)
    })

    it('returns undefined when called without any rules', () => {
      expect(check([], 'string')).to.be(undefined)
    })

    it('returns undefined when there is no match in the string', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar'
      }
      expect(check([ruleObject], 'string')).to.be(undefined)
    })

    it('returns a report object for each match', () => {
      const ruleObject = {
        name: 'Foo',
        match: /foo/,
        replace: 'bar'
      }
      const reports = check([ruleObject], 'Da foo foo')

      expect(reports).to.eql([
        {rule: 'Foo', range: [3, 6]},
        {rule: 'Foo', range: [7, 10]}
      ])
    })

    describe('with ignore rules', () => {
      it('applies the rules unless in excluded ranges', () => {
        const ruleObject = {
          name: 'Foo',
          match: /foo/,
          replace: 'bar'
        }
        const ignoreObject = {
          name: 'quotes',
          ignore: /"[^"]+"/
        }
        const reports = check([ruleObject, ignoreObject], 'foo "foo" foo "foo"')

        expect(reports).to.eql([
          {rule: 'Foo', range: [0, 3]},
          {rule: 'Foo', range: [10, 13]}
        ])
      })

      describe('that is inverted', () => {
        it('applies the rules unless in excluded ranges', () => {
          const ruleObject = {
            name: 'Foo',
            match: /foo/,
            replace: 'bar'
          }
          const ignoreObject = {
            name: 'quotes',
            ignore: /"[^"]+"/,
            invertRanges: true
          }
          const reports = check([ruleObject, ignoreObject], 'foo "foo" foo "foo"')

          expect(reports).to.eql([
            {rule: 'Foo', range: [5, 8]},
            {rule: 'Foo', range: [15, 18]}
          ])
        })
      })
    })
  })

  describe('fix', () => {
    it('throws when called without arguments', () => {
      expect(() => { fix() }).to.throwError()
      expect(() => { fix([]) }).to.throwError()
    })

    it('returns the string when called without any rules', () => {
      expect(fix([], 'string')).to.eql('string')
    })

    it('returns the string when there is no match', () => {
      const ruleObject = rule('Foo', /foo/, 'bar')

      expect(fix([ruleObject], 'string')).to.eql('string')
    })

    it('replaces instances of matches by the replacement string', () => {
      const ruleObject = rule('Foo', /foo/, 'bar')

      expect(fix([ruleObject], 'Da foo foo')).to.eql('Da bar bar')
    })

    it('applies the rules in order', () => {
      const ruleObject1 = rule('Foo', /foo/, 'bar')
      const ruleObject2 = rule('Foo', /foo/, 'baz')

      expect(fix([ruleObject1, ruleObject2], 'Da foo foo')).to.eql('Da bar bar')
    })

    describe('with ignore rules', () => {
      it('applies the rules unless in excluded ranges', () => {
        const ruleObject = rule('Foo', /foo|"/, 'bar')
        const ignoreObject = ignore('quotes', /"[^"]+"/)

        expect(fix([ruleObject, ignoreObject], 'foo "foo" foo "foo"')).to.eql('bar "foo" bar "foo"')
      })

      describe('that is inverted', () => {
        it('applies the rules unless in excluded ranges', () => {
          const ruleObject = rule('Foo', /foo|"/, 'bar')
          const ignoreObject = ignore('quotes', /"[^"]+"/, true)

          expect(fix([ruleObject, ignoreObject], 'foo "foo" foo "foo"')).to.eql('foo barbarbar foo barbarbar')
        })
      })
    })
  })

  describe('rule', () => {
    let ruleObject

    beforeEach(() => {
      ruleObject = rule('Foo', /foo/, 'bar')
    })

    it('throws if called without an argument', () => {
      expect(() => { rule() }).to.throwError()
      expect(() => { rule('foo') }).to.throwError()
      expect(() => { rule('foo', 'bar') }).to.throwError()
    })

    it('returns a rule object', () => {
      expect(ruleObject).not.to.be(undefined)
      expect(ruleObject.name).to.eql('Foo')
      expect(ruleObject.check).to.be.a(Function)
      expect(ruleObject.fix).to.be.a(Function)
    })

    describe('.check', () => {
      it('returns a report object for each match', () => {
        const reports = ruleObject.check('Da foo foo')

        expect(reports).to.eql([
          {rule: 'Foo', range: [3, 6]},
          {rule: 'Foo', range: [7, 10]}
        ])
      })

      it('returns an empty array if there is no match', () => {
        const reports = ruleObject.check('Da bar bar')

        expect(reports).to.eql([])
      })

      it('returns an empty array if the match equals the replacement string', () => {
        ruleObject = rule('Foo', /(\w{3})/, '$1')

        const reports = ruleObject.check('Da foo foo')

        expect(reports).to.eql([])
      })
    })

    describe('.fix', () => {
      it('replaces instances of matches by the replacement string', () => {
        expect(ruleObject.fix('Da foo foo')).to.eql('Da bar bar')
      })
    })

    describe('when the expression has the ignored case flag', () => {
      it('applies the flag to the internally created regexp', () => {
        ruleObject = rule('Foo', /foo/i, 'bar')

        expect(ruleObject.fix('foo')).to.eql('bar')
        expect(ruleObject.fix('FOO')).to.eql('bar')

        expect(ruleObject.check('foo')).to.have.length(1)
        expect(ruleObject.check('FOO')).to.have.length(1)
      })
    })

    describe('when the expression has the multiline flag', () => {
      it('applies the flag to the internally created regexp', () => {
        const ruleObject1 = rule('Foo', /^foo$/m, 'bar')
        const ruleObject2 = rule('Foo', /^foo$/, 'bar')

        expect(ruleObject1.fix('foo\nbar')).to.eql('bar\nbar')
        expect(ruleObject2.fix('foo\nbar')).to.eql('foo\nbar')

        expect(ruleObject1.check('foo\nbar')).to.have.length(1)
        expect(ruleObject2.check('foo\nbar')).to.have.length(0)
      })
    })
  })

  describe('ignore', () => {
    let ignoreObject

    beforeEach(() => {
      ignoreObject = ignore('Foo', /"[^"]+"/)
    })

    it('throws if called without an argument', () => {
      expect(() => { ignore() }).to.throwError()
      expect(() => { ignore('foo') }).to.throwError()
    })

    it('returns an ignore object', () => {
      expect(ignoreObject).not.to.be(undefined)
      expect(ignoreObject.ranges).to.be.a(Function)
    })

    describe('.ranges', () => {
      it('returns an array of ranges to ignore', () => {
        const ranges = ignoreObject.ranges('foo "foo" foo "foo"')

        expect(ranges).to.eql([
          [4, 9],
          [14, 19]
        ])
      })

      describe('when the invert range parameters is set to true', () => {
        it('returns ranges for parts not matched by the expression', () => {
          ignoreObject = ignore('Foo', /"[^"]+"/, true)

          const ranges = ignoreObject.ranges('foo "foo" foo "foo"')

          expect(ranges).to.eql([
            [0, 3],
            [9, 13],
            [19, 19]
          ])
        })
      })
    })

    describe('when the expression has the ignored case flag', () => {
      it('applies the flag to the internally created regexp', () => {
        ignoreObject = ignore('Foo', /foo/i)

        expect(ignoreObject.ranges('foo')).to.have.length(1)
        expect(ignoreObject.ranges('FOO')).to.have.length(1)
      })
    })

    describe('when the expression has the multiline flag', () => {
      it('applies the flag to the internally created regexp', () => {
        let ignoreObject1 = ignore('Foo', /^foo$/m)
        let ignoreObject2 = ignore('Foo', /^foo$/)

        expect(ignoreObject1.ranges('foo\nbar')).to.have.length(1)
        expect(ignoreObject2.ranges('foo\nbar')).to.have.length(0)
      })
    })
  })

  describe('group', () => {
    let ruleObject, ignoreObject

    beforeEach(() => {
      ruleObject = rule('Foo', /foo/, 'bar')
      ignoreObject = ignore('Bar', /bar/)
    })

    it('throws when called without any argument', () => {
      expect(() => { group() }).to.throwError()
    })

    it('throws when called with a name but no rules', () => {
      expect(() => { group('foo') }).to.throwError()
    })

    it('returns an array with the provided rules with a namespaced name', () => {
      const rules = group('bar', [ruleObject, ignoreObject])

      expect(rules).to.be.an(Array)
      expect(rules).to.have.length(2)
      expect(rules[0].name).to.eql('bar.Foo')
      expect(rules[0].check).to.be.a(Function)
      expect(rules[0].fix).to.be.a(Function)
      expect(rules[1].name).to.eql('bar.Bar')
      expect(rules[1].ranges).to.be.a(Function)
    })

    it('flatten rules coming from nested groups', () => {
      const rules = group('bar', [
        group('baz', [
          group('bat', [ruleObject])
        ])
      ])

      expect(rules).to.be.an(Array)
      expect(rules).to.have.length(1)
      expect(rules[0].name).to.eql('bar.baz.bat.Foo')
    })

    describe('without a name', () => {
      it('flatten rules coming from nested groups without changing their name', () => {
        const rules = group([
          group('baz', [
            group('bat', [ruleObject])
          ])
        ])

        expect(rules).to.be.an(Array)
        expect(rules).to.have.length(1)
        expect(rules[0].name).to.eql('baz.bat.Foo')
      })
    })

    describe('modified rules', () => {
      it('checks a string but reports use the new name', () => {
        const rules = group('bar', [ruleObject])
        const modifiedRule = rules[0]
        const reports = modifiedRule.check('Da foo foo')

        expect(reports).to.eql([
          {rule: 'bar.Foo', range: [3, 6]},
          {rule: 'bar.Foo', range: [7, 10]}
        ])
      })

      it('replaces instances of matches by the replacement string', () => {
        const modifiedRule = group('bar', [ruleObject])[0]

        expect(modifiedRule.fix('Da foo foo')).to.eql('Da bar bar')
      })
    })
  })
})
