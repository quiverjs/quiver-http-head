import { isImmutableMap } from 'quiver-util/immutable'

// Follow rules at http://httpwg.github.io/specs/rfc7230.html

const noUppercaseRegex = /^[^A-Z]*$/

// Allow header name characters except uppercase
const validHeaderNameRegex = /^[a-z0-9\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~]+$/

const validHeaderValueRegex = /^[\x20-\x7E\t]*$/

const validStatusRegex = /^\d{3}$/
const validSchemeRegex = /^[a-z][a-z0-9\+\-\.]*$/
const validTokenRegex = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~]+$/

const regNameRegex = `[a-zA-Z0-9\\-\\.\\_\\~` +
  `\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]` +
  `|\\%[0-9a-fA-F][0-9a-fA-F]`

const pcharRegex = `${regNameRegex}|[\\:\\@]`
const qcharRegex = `${pcharRegex}|\\?\\/`
const pathnameRegex = `\\/((${pcharRegex})+(${pcharRegex}|\\/)*)?`

// Loose rules for ipv6. To be improved in future
const ipv6Regex = `\\[[0-9a-fA-F\\:]+\\]`
const hostnameRegex = `((${regNameRegex})+|(${ipv6Regex})+)`

const validPathnameRegex = new RegExp(`^${pathnameRegex}$`)
const validSearchRegex = new RegExp(`^\\?(${pcharRegex})*$`)
const validPathRegex = new RegExp(`^${pathnameRegex}\\??(${qcharRegex})*$`)

const validAuthorityRegex = new RegExp(`^${hostnameRegex}(\\:\\d{1,5})?$`)
const validHostnameRegex = new RegExp(`^${hostnameRegex}$`)
const validPortRegex = /^\d{1,5}$/

const assertRegex = (regex, str, errorMessage) => {
  if (typeof(str) !== 'string')
    throw new TypeError('argument must be string')

  if(!regex.test(str))
    throw new Error(errorMessage + ': ' + str)
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
  if (!isImmutableMap(query))
    throw new TypeError('query must be an immutable map')

  for (let [key, value] of query.entries()) {
    validateKeyValue(key)
    validateKeyValue(value)
  }
}
