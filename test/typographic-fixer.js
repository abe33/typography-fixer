import expect from 'expect.js'
import typo from '../src/typographic-fixer'

describe('rules', () => {
  it('throws when called without a lang', () => {
    expect(() => { typo.rules() }).to.throwError()
  })

  it('throws when called without a block', () => {
    expect(() => { typo.rules('lang') }).to.throwError()
  })

  it('calls the passed-in function with a rules object', () => {
    let rulesObject
    typo.rules('lang', (rules) => {
      rulesObject = rules
    })

    expect(rulesObject).not.to.be(undefined)
  })

  describe('defining a rule', () => {
    it('makes it available in check method', () => {
      typo.rules('lang', ({define}) => {
        define('Foo', /foo/g, 'bar')
      })

      expect(typo.check('Da foo', {lang: 'lang'})).to.have.length(1)
      expect(typo.check('Da bar', {lang: 'lang'})).to.be(undefined)
    })

    it('makes it available in fix method', () => {
      typo.rules('lang', ({define}) => {
        define('Foo', /foo/g, 'bar')
      })

      expect(typo.fix('Da foo', {lang: 'lang'})).to.eql('Da bar')
    })
  })
})
