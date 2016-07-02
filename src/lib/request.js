import {
  ImmutableMap, isImmutableMap
} from 'quiver-util/immutable'

import {
  parse as parseQueryString,
  stringify as queryStringify
} from 'querystring'

import {
  HttpHead, $getHeader, $setHeader
} from './head'

const $cachedPort = Symbol('@cachedPort')
const $cachedQuery = Symbol('@cachedQuery')
const $cachedSearch = Symbol('@cachedSearch')
const $cachedHostname = Symbol('@cachedHostname')
const $cachedPathname = Symbol('@cachedPathname')

const parsePath = requestHead => {
  const { path } = requestHead
  if (!path) return {}

  const [ pathname, queryString='' ] = path.split('?')
  const search = '?' + queryString

  requestHead[$cachedPathname] = pathname
  requestHead[$cachedSearch] = search

  return { pathname, search }
}

const parseAuthority = requestHead => {
  const { authority } = requestHead
  if (!authority) return {}

  const [hostname, port] = authority.split(':')

  if(hostname !== '') {
    requestHead[$cachedHostname] = hostname
  }

  if (port && port !== '') {
    requestHead[$cachedPort] = port
  }

  return { hostname, port }
}

export class RequestHead extends HttpHead {
  constructor(opts) {
    super(opts)

    // optimize for hidden class
    this[$cachedPort] = null
    this[$cachedQuery] = null
    this[$cachedSearch] = null
    this[$cachedHostname] = null
    this[$cachedPathname] = null
  }

  get method() {
    return this[$getHeader](':method')
  }

  get path() {
    return this[$getHeader](':path')
  }

  get scheme() {
    return this[$getHeader](':scheme', 'http')
  }

  get authority() {
    return this[$getHeader](':authority')
  }

  setMethod(method) {
    return this[$setHeader](':method', method)
  }

  setPath(path) {
    return this[$setHeader](':path', path)
  }

  setScheme(scheme) {
    return this[$setHeader](':scheme', scheme)
  }

  setAuthority(authority) {
    return this[$setHeader](':authority', authority)
  }

  get remoteAddress() {
    return this[$getHeader](':remote-address')
  }

  get args() {
    let args = this[$getHeader](':args') || ImmutableMap()
    args = args.set('requestHead', this)

    return args
  }

  setArgs(args) {
    if (!isImmutableMap(args))
      throw new TypeError('args must be an immutable map')

    return this[$setHeader](':args', args)
  }

  setArgsKey(key, value) {
    return this.setArgs(this.args.set(key, value))
  }

  // request.path derivatives

  get pathname() {
    if (this[$cachedPathname]) return this[$cachedPathname]
    return parsePath(this).pathname
  }

  get search() {
    if (this[$cachedSearch]) return this[$cachedSearch]

    return parsePath(this).search
  }

  get query() {
    if (this[$cachedQuery]) return this[$cachedQuery]

    const { search } = this
    const parsed = parseQueryString(search.slice(1))
    const query = ImmutableMap(parsed)

    this[$cachedQuery] = query
    return query
  }

  setPathname(pathname) {
    if (!this.path)
      return this.setPath(pathname)

    const { search } = this
    const path = (search === '?') ?
      pathname : (pathname + search)

    return this.setPath(path)
  }

  setSearch(search) {
    if (!this.path)
      return this.setPath('/' + search)

    const path = this.pathname + search
    return this.setPath(path)
  }

  setQuery(query) {
    const queryString = queryStringify(query.toObject())
    const search = '?' + queryString

    const newRequest = this.setSearch(search)

    newRequest[$cachedQuery] = query
    return newRequest
  }

  setQueryKey(key, value) {
    return this.setQuery(this.query.set(key, value))
  }

  // request.authority derivatives

  get hostname() {
    if (this[$cachedHostname]) return this[$cachedHostname]
    return parseAuthority(this).hostname
  }

  get port() {
    // use cachedHostname because parsed port may be undefined
    if (this[$cachedHostname]) return this[$cachedPort]
    return parseAuthority(this).port
  }

  setHostname(hostname) {
    const { port } = this
    const authority = port ? `${hostname}:${port}` : hostname

    return this.setAuthority(authority)
  }

  setPort(port) {
    if (typeof(port) === 'number')
      port = port.toString()

    const authority = `${this.hostname}:${port}`

    return this.setAuthority(authority)
  }

  get isRequestHead() {
    return true
  }
}
