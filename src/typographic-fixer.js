
const rulesLibrary = {}

function check (string, options = {}) {
  let {lang} = options
  if (!lang) { lang = 'en' }

  const rules = rulesLibrary[lang]
  let results = []

  if (!rules) { return undefined }

  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i]
    results = results.concat(rule.check(string))
  }

  return results.length > 0 ? results : undefined
}

function fix (string, options = {}) {
  let {lang} = options
  if (!lang) { lang = 'en' }

  const rules = rulesLibrary[lang]

  if (!rules) { return string }

  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i]
    string = rule.fix(string)
  }

  return string
}

function rules (lang, block) {
  if (typeof lang !== 'string') {
    throw new Error("Can't call rules without a lang")
  }

  if (typeof block !== 'function') {
    throw new Error("Can't call rules without a function")
  }

  const definedRules = evaluateBlock(block)

  rulesLibrary[lang] = (rulesLibrary[lang] || []).concat(definedRules)
}

function evaluateBlock (block) {
  const rules = []

  function define (name, expression, replacement) {
    rules.push({
      name,
      check (string) {
        const re = new RegExp(expression.source, 'g')
        const matches = []
        let match
        while (match = expression.exec(string)) { matches.push(match) }
        return matches
      },
      fix (string) {
        const re = new RegExp(expression.source, 'g')
        return string.replace(re, replacement)
      }
    })
  }

  block({define})

  return rules
}

function merge (a, b) {
  const o = {}

  for (const key in a) { o[key] = a[key] }
  for (const key in b) { o[key] = b[key] }

  return o
}

export default {rules, check, fix}
