import { Map as ImmutableMap } from 'immutable'

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
  if(!path)
    throw new Error('request path is not defined')

  const [pathname, queryString=''] = path.split('?')
  const search = '?' + queryString

  requestHead[$cachedPathname] = pathname
  requestHead[$cachedSearch] = search

  return { pathname, search }
}

const parseAuthority = requestHead => {
  const { authority } = requestHead
  if(!authority)
    throw new Error('request authority is not define')

  const [hostname, port] = authority.split(':')

  requestHead[$cachedHostname] = hostname
  if(port) requestHead[$cachedPort] = port

  return { hostname, port }
}

export class RequestHead extends HttpHead {
  get method() {
    return this[$getHeader](':method')
  }

  get path() {
    return this[$getHeader](':path')
  }

  get scheme() {
    return this[$getHeader](':scheme')
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
    const args = this[$getHeader](':args') || new ImmutableMap()
    return args.set('requestHead', this)
  }

  setArgs(args) {
    if(!ImmutableMap.isMap(args))
      throw new TypeError('args must be an immutable map')

    return this[$setHeader](':args', args)
  }

  setArgsKey(key, value) {
    return this.setArgs(this.args.set(key, value))
  }

  // request.path derivatives

  get pathname() {
    if(this[$cachedPathname]) return this[$cachedPathname]
    return parsePath(this).pathname
  }

  get search() {
    if(this[$cachedSearch]) return this[$cachedSearch]

    return parsePath(this).search
  }

  get query() {
    if(this[$cachedQuery]) return this[$cachedQuery]

    const { search } = this
    const parsed = parseQueryString(search.slice(1))
    const query = new ImmutableMap(parsed)

    this[$cachedQuery] = query
    return query
  }

  setPathname(pathname) {
    if(!this.path)
      return this.setPath(pathname)

    const { search } = this
    const path = (search === '?') ?
      pathname : (pathname + search)

    return this.setPath(path)
  }

  setSearch(search) {
    if(!this.path)
      return this.setPath('/' + search)

    const path = this.pathname + search
    return this.setPath(path)
  }

  setQuery(query) {
    const queryString = queryStringify(query.toObject())
    const search = '?' + queryString

    return this.setSearch(search)
  }

  setQueryKey(key, value) {
    return this.setQuery(this.query.set(key, value))
  }

  // request.authority derivatives

  get hostname() {
    if(this[$cachedHostname]) return this[$cachedHostname]
    return parseAuthority(this).hostname
  }

  get port() {
    // use cachedHostname because parsed port may be undefined
    if(this[$cachedHostname]) return this[$cachedPort]
    return parseAuthority(this).port
  }

  setHostname(hostname) {
    const { port } = this
    const authority = port ? hostname : `${hostname}:${port}`

    return this.setAuthority(authority)
  }

  setPort(port) {
    if(typeof(port) === 'number')
      port = port.toString()

    const authority = `${this.hostname}:${port}`

    return this.setAuthority(authority)
  }

  get isRequestHead() {
    return true
  }
}
