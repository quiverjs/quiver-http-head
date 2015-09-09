import { Map as ImmutableMap } from 'immutable'

import { RequestHead, $createQueryMap } from './request'
import { ResponseHead } from './response'

import {
  validateKeyValue,
  validateHeaderName,
  validateHeaderValue,
  validateStatus,
  validatePath,
  validateMethod,
  validateScheme,
  validateAuthority,
  validatePathname,
  validateSearch,
  validateQuery,
  validateHostname,
  validatePort
} from './validate'

class ValidatedMap extends ImmutableMap {
  set(key, value) {
    validateKeyValue(key)
    validateKeyValue(value)
    return super.set(key, value)
  }
}

export class ValidatedResponseHead extends ResponseHead {
  setHeader(name, value) {
    validateHeaderName(name)
    validateHeaderValue(value)
    return super.setHeader(name, value)
  }

  getHeader(name) {
    validateHeaderName(name)
    return super.getHeader(name)
  }

  deleteHeader(name) {
    validateHeaderName(name)
    return super.deleteHeader(name)
  }

  setStatus(status) {
    if(typeof(status) === 'number')
      status = status.toString()

    validateStatus(status)
    return super.setStatus(status)
  }
}

export class ValidatedRequestHead extends RequestHead {
  constructor(rawHeaders=new ValidatedMap()) {
    super(rawHeaders)
  }

  setHeader(name, value) {
    validateHeaderName(name)
    validateHeaderValue(value)
    return super.setHeader(name, value)
  }

  getHeader(name) {
    validateHeaderName(name)
    return super.getHeader(name)
  }

  deleteHeader(name) {
    validateHeaderName(name)
    return super.deleteHeader(name)
  }

  setMethod(method) {
    validateMethod(method)
    return super.setMethod(method)
  }

  setPath(path) {
    validatePath(path)
    return super.setPath(path)
  }

  setScheme(scheme) {
    validateScheme(scheme)
    return super.setScheme(scheme)
  }

  setAuthority(authority) {
    validateAuthority(authority)
    return super.setAuthority(authority)
  }

  setPathname(pathname) {
    validatePathname(pathname)
    return super.setPathname(pathname)
  }

  setSearch(search) {
    validateSearch(search)
    return super.setSearch(search)
  }

  [$createQueryMap](...args) {
    return new ValidatedMap(...args)
  }

  setQuery(query) {
    validateQuery(query)
    return super.setQuery(query)
  }

  setHostname(hostname) {
    validateHostname(hostname)
    return super.setHostname(hostname)
  }

  setPort(port) {
    if(typeof(port) === 'number')
      port = port.toString()

    validatePort(port)
    return super.setPort(port)
  }
}
