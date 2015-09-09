import {
  HttpHead, $getHeader, $setHeader
} from './head'

export class ResponseHead extends HttpHead {
  get status() {
    return this[$getHeader](':status')
  }

  setStatus(status) {
    if(typeof(status) === 'number')
      status = status.toString()

    return this[$setHeader](':status', status)
  }

  get isResponseHead() {
    return true
  }
}
