import test from 'tape'

import {
  ValidatedRequestHead as RequestHead,
  ValidatedResponseHead as ResponseHead
} from '../lib'

test('request head test', assert => {
  const req1 = new RequestHead()
  assert.notOk(req1.getHeader('content-type'))

  const req2 = req1.setHeader('content-type', 'text/plain')
  assert.equal(req2.getHeader('content-type'), 'text/plain')
  assert.notOk(req1.getHeader('content-type'))

  assert.throws(() => req1.setHeader('Content-Type', 'text/plain'),
    'should not allow header set with uppercase characters')

  assert.throws(() => req1.setHeader(Symbol(), 'invalid'),
    'should not allow non-string header name')

  assert.throws(() => req1.setHeader('content-type', null),
    'should not allow non-string header value')

  assert.end()
})
