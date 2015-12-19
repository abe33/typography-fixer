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
    throw new Error('The fix arguments are mandatory')
  }

  if (rules.length === 0) { return string }

  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i]
    string = rule.fix(string)
  }

  return string
}

export function group (name, rules) {
  let groupName

  if (Array.isArray(name)) {
    rules = name
    groupName = []
  } else {
    if (!name || !rules) {
      throw new Error('The group rules argument is mandatory')
    }
    groupName = [name]
  }

  return rules.reduce((memo, el) => {
    return memo.concat(el)
  }, []).map((rule) => {
    return {
      name: groupName.concat(rule.name).join('.'),
      check: rule.check,
      fix: rule.fix
    }
  })
}

export function rule (name, expression, replacement) {
  if (!name || !expression || !replacement) {
    throw new Error('All arguments of the rule function are mandatory')
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

export function ignore (name, expression) {
  if (!name || !expression) {
    throw new Error('All arguments of the ignore function are mandatory')
  }

  let source

  if (expression instanceof RegExp) {
    source = expression.source
  } else {
    source = expression
  }

  return {
    name,
    ranges (string) {
      const re = new RegExp(source, 'g')
      const ranges = []
      let match

      do {
        match = re.exec(string)
        if (match) { ranges.push([match.index, re.lastIndex]) }
      } while (match)

      return ranges
    }
  }
}
