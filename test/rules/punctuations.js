import expect from 'expect.js'
import {fix, check} from '../../src/typography-fixer'
import rules from '../../src/rules/punctuations'

const fixString = fix(rules)
const checkString = check(rules)

describe('punctuations rules', () => {
  let etcTests = [
    ['Etc...', 'Etc.'],
    ['Etc\u2026', 'Etc.'],
    ['etc...', 'etc.'],
    ['etc\u2026', 'etc.']
  ]
  etcTests.forEach(([source, expected]) => {
    it(`replaces ${source} by ${expected}`, () => {
      expect(fixString(source)).to.eql(expected)
    })
  })

  it('checks etc. only when followed by an ellipsis', () => {
    expect(checkString('etc.')).to.be(undefined)
    expect(checkString('Etc.')).to.be(undefined)
  })

  it('replaces two or more ! with a single !', () => {
    expect(fixString('Foo!!')).to.eql('Foo!')
    expect(fixString('Foo!!!')).to.eql('Foo!')
    expect(fixString('Foo!!!!')).to.eql('Foo!')
  })

  it('replaces two or more ? with a single ?', () => {
    expect(fixString('Foo??')).to.eql('Foo?')
    expect(fixString('Foo???')).to.eql('Foo?')
    expect(fixString('Foo????')).to.eql('Foo?')
  })

  it('checks multiple punctuation chars only if there is two or more chars', () => {
    expect(checkString('Foo!')).to.be(undefined)
    expect(checkString('Foo?')).to.be(undefined)
  })

  it('replaces triple dots with a proper ellipsis', () => {
    expect(fixString('Foo...')).to.eql('Foo\u2026')
  })

  it('replaces a hyphen between two characters with a non-breaking hyphen', () => {
    expect(fixString('foo-bar')).to.eql('foo\u2011bar')
    expect(fixString('foo - bar')).to.eql('foo - bar')
    expect(fixString('- bar')).to.eql('- bar')
    expect(fixString('foo -')).to.eql('foo -')

    expect(checkString('foo-bar')).to.have.length(1)
    expect(checkString('foo\u2011bar')).to.be(undefined)
  })
})
