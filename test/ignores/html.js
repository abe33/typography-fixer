import expect from 'expect.js'
import {concat} from 'ramda'
import {fix, rule} from '../../src/typography-fixer'
import ignores from '../../src/ignores/html'

const ruleObject = rule('Foo', /<|>|=|"|foo/, 'bar')
const rules = concat([ruleObject], ignores)
const fixString = fix(rules)

describe('html ignores', () => {
  it('preserves tags', () => {
    expect(fixString('<foo>foo</foo>')).to.eql('<foo>bar</foo>')
  })

  it('preserves content of pre tags', () => {
    expect(fixString('<pre>foo</pre> foo')).to.eql('<pre>foo</pre> bar')
    expect(fixString('<pre class="pre">foo</pre> foo')).to.eql('<pre class="pre">foo</pre> bar')
  })

  it('preserves content of code tags', () => {
    expect(fixString('<code>foo</code> foo')).to.eql('<code>foo</code> bar')
    expect(fixString('<code class="code">foo</code> foo')).to.eql('<code class="code">foo</code> bar')
  })

  it('preserves content of kbd tags', () => {
    expect(fixString('<kbd>foo</kbd> foo')).to.eql('<kbd>foo</kbd> bar')
    expect(fixString('<kbd class="kbd">foo</kbd> foo')).to.eql('<kbd class="kbd">foo</kbd> bar')
  })

  it('preserves content of style tags', () => {
    expect(fixString('<style>foo</style> foo')).to.eql('<style>foo</style> bar')
    expect(fixString('<style class="style">foo</style> foo')).to.eql('<style class="style">foo</style> bar')
  })

  it('preserves content of script tags', () => {
    expect(fixString('<script>foo</script> foo')).to.eql('<script>foo</script> bar')
    expect(fixString('<script class="script">foo</script> foo')).to.eql('<script class="script">foo</script> bar')
  })

  it('preserves content of textarea tags', () => {
    expect(fixString('<textarea>foo</textarea> foo')).to.eql('<textarea>foo</textarea> bar')
    expect(fixString('<textarea class="textarea">foo</textarea> foo')).to.eql('<textarea class="textarea">foo</textarea> bar')
  })
})
