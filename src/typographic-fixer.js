export default function typographyFixer (lang) {
  const rulesLibrary = {}

  if (lang) {
    return {
      rules (block) { rules(lang, block) },
      hasRule (rule) { return hasRule(lang, rule) },
      check (string, options={}) { return check(string, merge(options, {lang})) },
      fix (string, options={}) { return fix(string, merge(options, {lang})) }
    }
  } else {
    return {rules, hasRule, check, fix}
  }

  function check (string, options = {}) {
    if (!string) {
      throw new Error('The string argument is mandatory')
    }

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
    if (!string) {
      throw new Error('The string argument is mandatory')
    }

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
}

function evaluateBlock (block) {
  const rules = []

  block(getRulesContext(rules, []))

  return rules
}

function getRulesContext (rules, context) {
  return {group, define}

  function group (name, block) {
    if (!name || !block) {
      throw new Error('All arguments of the group function are mandatory')
    }

    block(getRulesContext(rules, context.concat(name)))
  }

  function define (name, expression, replacement) {
    if (!name || !expression || !replacement) {
      throw new Error('All arguments of the define function are mandatory')
    }

    let source
    if (expression instanceof RegExp) {
      source = expression.source
    } else {
      source = expression
    }

    const ruleName = context.concat(name).join('.')

    rules.push({
      name: ruleName,
      check (string) {
        const re = new RegExp(source, 'g')
        const matches = []
        let match
        do {
          match = re.exec(string)
          if (match) {
            matches.push({
              rule: ruleName,
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
}

function merge (a, b) {
  const o = {}

  for (const key in a) { o[key] = a[key] }
  for (const key in b) { o[key] = b[key] }

  return o
}
