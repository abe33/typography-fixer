export default function typographyFixer () {
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

  function hasRule (lang, ruleName) {
    const langRules = rulesLibrary[lang]
    if (!langRules) { return false }

    return langRules.some((rule) => { return rule.name === ruleName })
  }

  return {rules, hasRule, check, fix}
}

function evaluateBlock (block) {
  const rules = []

  function define (name, expression, replacement) {
    let source
    if (expression instanceof RegExp) {
      source = expression.source
    } else {
      source = expression
    }

    rules.push({
      name,
      check (string) {
        const re = new RegExp(source, 'g')
        const matches = []
        let match
        do {
          match = re.exec(string)
          if (match) {
            matches.push({
              rule: name,
              range: [match.index, re.lastIndex]
            })
          }
        } while (match)

        return matches
      },
      fix (string) {
        const re = new RegExp(source, 'g')
        return string.replace(re, replacement)
      }
    })
  }

  block({define})

  return rules
}
