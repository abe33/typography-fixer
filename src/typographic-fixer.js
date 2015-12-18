export function check (rules, string) {
  if (!rules || !string) {
    throw new Error('The check arguments are mandatory')
  }

  let results = []

  if (rules.length === 0) { return undefined }

  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i]
    results = results.concat(rule.check(string))
  }

  return results.length > 0 ? results : undefined
}

export function fix (rules, string) {
  if (!rules || !string) {
    throw new Error('The string argument is mandatory')
  }

  if (rules.length === 0) { return string }

  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i]
    string = rule.fix(string)
  }

  return string
}

export function group (name, rules) {
  return rules.reduce((memo, el) => {
    return memo.concat(el)
  }, []).map((rule) => {
    return {
      name: name + '.' + rule.name,
      check: rule.check,
      fix: rule.fix
    }
  })
}

export function rule (name, expression, replacement) {
  if (!name || !expression || !replacement) {
    throw new Error('All arguments of the define function are mandatory')
  }

  let source

  if (expression instanceof RegExp) {
    source = expression.source
  } else {
    source = expression
  }

  return {
    name,
    check (string) {
      const re = new RegExp(source, 'g')
      const matches = []
      let match
      do {
        match = re.exec(string)
        if (match) {
          matches.push({
            rule: this.name,
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
  }
}
