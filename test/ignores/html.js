import expect from 'expect.js'
import {fix, rule} from '../../src/typography-fixer'
import ignores from '../../src/ignores/html'

describe('html ignores', () => {
  let ruleObject, rules

  beforeEach(() => {
    ruleObject = rule('Foo', /<|>|=|"|foo/, 'bar')
    rules = [ruleObject].concat(ignores)
  })

  it('preserves tags', () => {
    expect(fix(rules, '<foo>foo</foo>')).to.eql('<foo>bar</foo>')
  })

  it('preserves content of pre tags', () => {
    expect(fix(rules, '<pre>foo</pre> foo')).to.eql('<pre>foo</pre> bar')
    expect(fix(rules, '<pre class="pre">foo</pre> foo')).to.eql('<pre class="pre">foo</pre> bar')
  })

  it('preserves content of code tags', () => {
    expect(fix(rules, '<code>foo</code> foo')).to.eql('<code>foo</code> bar')
    expect(fix(rules, '<code class="code">foo</code> foo')).to.eql('<code class="code">foo</code> bar')
  })

  it('preserves content of kbd tags', () => {
    expect(fix(rules, '<kbd>foo</kbd> foo')).to.eql('<kbd>foo</kbd> bar')
    expect(fix(rules, '<kbd class="kbd">foo</kbd> foo')).to.eql('<kbd class="kbd">foo</kbd> bar')
  })

  it('preserves content of style tags', () => {
    expect(fix(rules, '<style>foo</style> foo')).to.eql('<style>foo</style> bar')
    expect(fix(rules, '<style class="style">foo</style> foo')).to.eql('<style class="style">foo</style> bar')
  })

  it('preserves content of script tags', () => {
    expect(fix(rules, '<script>foo</script> foo')).to.eql('<script>foo</script> bar')
    expect(fix(rules, '<script class="script">foo</script> foo')).to.eql('<script class="script">foo</script> bar')
  })

  it('preserves content of textarea tags', () => {
    expect(fix(rules, '<textarea>foo</textarea> foo')).to.eql('<textarea>foo</textarea> bar')
    expect(fix(rules, '<textarea class="textarea">foo</textarea> foo')).to.eql('<textarea class="textarea">foo</textarea> bar')
  })
})
