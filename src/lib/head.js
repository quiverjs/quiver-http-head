import { Map as ImmutableMap } from 'immutable'

// Polyfill Symbol.species
if(!Symbol.species)
  Symbol.species = Symbol('@@species')

const $species = Symbol.species
const $headers = Symbol('@headers')

export const $getHeader = Symbol('@getHeader')
export const $setHeader = Symbol('@setHeader')
export const $deleteHeader = Symbol('@deleteHeader')

const constructInstance = (source, args) => {
  let { constructor } = source
  if(constructor[$species])
    constructor = constructor[$species]

  return new constructor(args)
}

export class HttpHead {
  constructor(rawHeaders=new ImmutableMap()) {
    if(!ImmutableMap.isMap(rawHeaders))
      throw new TypeError('raw header must be an immutable map')

    this[$headers] = rawHeaders
  }

  [$getHeader](key) {
    return this[$headers].get(key)
  }

  [$setHeader](key, value) {
    const newHeaders = this[$headers].set(key, value)
    return constructInstance(this, newHeaders)
  }

  [$deleteHeader](key) {
    const newHeaders = this[$headers].delete(key)
    return constructInstance(this, newHeaders)
  }

  setHeader(name, value) {
    return this[$setHeader](name, value)
  }

  getHeader(name) {
    return this[$getHeader](name)
  }

  deleteHeader(name) {
    return this[$deleteHeader](name)
  }

  get rawHeaders() {
    return this[$headers]
  }

  *headerEntries() {
    for (let [key, value] of this[$headers].entries()) {
      if(key[0] !== ':')
        yield [key, value]
    }
  }

  headerObject() {
    const header = Object.create(null)
    for (let [key, value] of this.headerEntries()) {
      header[key] = value
    }
    return header
  }
}
