import expect from 'expect.js'
import typo from '../src/typographic-fixer'

describe('typographyFixer', () => {
  let [fixer] = []

  beforeEach(() => {
    fixer = typo()
  })

  it('returns a new fixer object', () => {
    expect(fixer.check).to.be.a(Function)
    expect(fixer.fix).to.be.a(Function)
    expect(fixer.rules).to.be.a(Function)
  })

  describe('when called with a lang as argument', () => {
    it('returns a fixer locked on this language', () => {
      fixer = typo('lang')

      fixer.rules(({define, group}) => {
        define('Foo', 'foo', 'bar')
        group('bar', ({define}) => {
          define('Da', 'Da', 'Ad')
        })
      })

      expect(fixer.hasRule('Foo')).to.be.ok()
      expect(fixer.hasRule('bar.Da')).to.be.ok()
      expect(fixer.check('Da foo foo')).to.have.length(3)
      expect(fixer.fix('Da foo foo')).to.eql('Ad bar bar')
    })
  })

  describe('.rules', () => {
    it('throws when called without a lang', () => {
      expect(() => { fixer.rules() }).to.throwError()
    })

    it('throws when called without a block', () => {
      expect(() => { fixer.rules('lang') }).to.throwError()
    })

    it('calls the passed-in function with a rules object', () => {
      let rulesObject
      fixer.rules('lang', (rules) => {
        rulesObject = rules
      })

      expect(rulesObject).not.to.be(undefined)
    })

    describe('defining a rule', () => {
      it('makes it available in check method', () => {
        fixer.rules('lang', ({define}) => {
          define('Foo', /foo/, 'bar')
        })

        expect(fixer.check('Da foo foo', {lang: 'lang'})).to.have.length(2)
        expect(fixer.check('Da bar', {lang: 'lang'})).to.be(undefined)
      })

      it('makes it available in fix method', () => {
        fixer.rules('lang', ({define}) => {
          define('Foo', /foo/, 'bar')
        })

        expect(fixer.fix('Da foo foo', {lang: 'lang'})).to.eql('Da bar bar')
      })

      it('makes it available only for the defined lang', () => {
        fixer.rules('lang', ({define}) => {
          define('Foo', /foo/, 'bar')
        })

        expect(fixer.check('Da foo foo', {lang: 'en'})).to.be(undefined)
        expect(fixer.fix('Da foo foo', {lang: 'en'})).to.eql('Da foo foo')
      })

      describe('with a string as expression', () => {
        it('creates a rules using the string as source for the regexp', () => {
          fixer.rules('lang', ({define}) => {
            define('Foo', 'foo', 'bar')
          })

          expect(fixer.check('Da foo foo', {lang: 'lang'})).to.have.length(2)
          expect(fixer.fix('Da foo foo', {lang: 'lang'})).to.eql('Da bar bar')
        })
      })

      describe('with a function as replacement', () => {
        it('creates a rules using the function as a replacement function', () => {
          fixer.rules('lang', ({define}) => {
            define('Foo', 'foo', (s) => { return s[0] })
          })

          expect(fixer.fix('Da foo foo', {lang: 'lang'})).to.eql('Da f f')
        })
      })
    })

    describe('defining a group', () => {
      beforeEach(() => {
        fixer.rules('lang', ({group}) => {
          group('bar', ({define}) => {
            define('Foo', 'foo', 'bar')
          })
        })
      })

      it('takes a function to define rules for the group', () => {
        expect(fixer.hasRule('lang', 'bar.Foo')).to.be.ok()
      })

      it('applies the rule as any other', () => {
        expect(fixer.fix('Da foo foo', {lang: 'lang'})).to.eql('Da bar bar')
      })
    })
  })

  describe('.hasRule', () => {
    it('returns true when a rule exist for the specified lang', () => {
      fixer.rules('lang', ({define}) => {
        define('Foo', /foo/, 'bar')
      })

      expect(fixer.hasRule('lang', 'Foo')).to.be.ok()
    })

    it('returns false when a rule does noe exist for the specified lang', () => {
      fixer.rules('lang', ({define}) => {
        define('Foo', /foo/, 'bar')
      })

      expect(fixer.hasRule('lang', 'bar')).not.to.be.ok()
    })

    it('returns false when the lang has no rule', () => {
      expect(fixer.hasRule('lang', 'Foo')).not.to.be.ok()
    })
  })

  describe('.check', () => {
    it('returns a report of the broken rules with concerned ranges', () => {
      fixer.rules('lang', ({define}) => {
        define('Foo', /foo/, 'bar')
      })

      const reports = fixer.check('Da foo foo', {lang: 'lang'})

      expect(reports).to.eql([
        {rule: 'Foo', range: [3, 6]},
        {rule: 'Foo', range: [7, 10]}
      ])
    })
  })
})
