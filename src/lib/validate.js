import { Map as ImmutableMap } from 'immutable'

const noUppercaseRegex = /^[^A-Z]*$/
const validHeaderValueRegex = /^[\x20-\x7E]*$/

// Allowed header name characters except uppercase
// http://httpwg.github.io/specs/rfc7230.html#rule.token.separators
const validHeaderNameRegex = /^[a-z0-9\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~]+$/

const validStatusRegex = /^\d{3}$/
const validSchemeRegex = /^[a-z][a-z0-9\+\-\.]*$/
const validTokenRegex = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~]+$/

const regNameRegex = `[a-zA-Z\\-\\.\\_\\~` +
  `\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]` +
  `|\\%[0-9a-fA-F][0-9a-fA-F]`

const pcharRegex = regNameRegex + `|[\\:\\@]`

const validPathnameRegex = new RegExp(`^/(${pcharRegex})*$`)
const validSearchRegex = new RegExp(`^\\?(${pcharRegex})*$`)
const validPathRegex = new RegExp(`^/(${pcharRegex})*\\??(${pcharRegex})*$`)

const validAuthorityRegex = new RegExp(`^${regNameRegex}+(\\:\\d+)?$/`)
const validHostnameRegex = new RegExp(`^${regNameRegex}+$/`)
const validPortRegex = /^\d+$/

const assertRegex = (regex, str, errorMessage) => {
  if (typeof(str) !== 'string')
    throw new TypeError('argument must be string')

  if(!regex.test(str))
    throw new Error(errorMessage)
}

export const validateKeyValue = str => {
  if (typeof(str) !== 'string')
    throw new TypeError('key/value must be string')
}

export const validateHeaderName = name => {
  assertRegex(noUppercaseRegex, name,
    'header name must be converted to lowercase')

  assertRegex(validHeaderNameRegex, name,
    'header name contains invalid character')
}

export const validateHeaderValue = value => {
  assertRegex(validHeaderValueRegex, value,
    'header value contains invalid character')
}

export const validateMethod = method => {
  assertRegex(validTokenRegex, method,
    'method contains invalid character')
}

export const validatePath = path => {
  if (path === '/' || path === '*') return

  assertRegex(validPathRegex, path,
    'request path contains invalid character')
}

export const validateScheme = scheme => {
  assertRegex(validSchemeRegex, scheme,
    'scheme contains invalid character')
}

export const validateAuthority = authority => {
  assertRegex(validAuthorityRegex, authority,
    'request authority contains invalid character')
}

export const validateStatus = status => {
  assertRegex(validStatusRegex, status,
    'response status contains invalid character')
}

export const validatePathname = pathname => {
  assertRegex(validPathnameRegex, pathname,
    'request pathname contains invalid character')
}

export const validateSearch = search => {
  assertRegex(validSearchRegex, search,
    'request search contains invalid character')
}

export const validateHostname = hostname => {
  assertRegex(validHostnameRegex, hostname,
    'request hostname contains invalid character')
}

export const validatePort = port => {
  assertRegex(validPortRegex, port,
    'request port contains invalid character')
}

export const validateQuery = query => {
  if (!ImmutableMap.isMap(query))
    throw new TypeError('query must be an immutable map')

  for (let [key, value] of query.entries()) {
    validateKeyValue(key)
    validateKeyValue(value)
  }
}
