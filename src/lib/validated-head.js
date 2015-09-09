import { RequestHead } from './request'
import { ResponseHead } from './response'
import { mixinCreateHeadMethod } from './mixin'

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

  setQuery(query) {
    validateQuery(query)
    return super.setQuery(query)
  }

  setQueryKey(key, value) {
    validateKeyValue(key)
    validateKeyValue(value)
    return super.setQueryKey(key, value)
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

mixinCreateHeadMethod(RequestHead, ResponseHead)
mixinCreateHeadMethod(ValidatedRequestHead, ValidatedResponseHead)
