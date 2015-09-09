import test from 'tape'

import {
  ValidatedRequestHead as RequestHead,
  ValidatedResponseHead as ResponseHead
} from '../lib'

test('request head test', assert => {
  const req1 = new RequestHead()

  assert.test('set header', assert => {
    assert.notOk(req1.getHeader('content-type'))

    const req2 = req1.setHeader('content-type', 'text/plain')
    assert.equal(req2.getHeader('content-type'), 'text/plain')
    assert.notOk(req1.getHeader('content-type'))

    assert.end()
  })

  assert.test('set invalid header', assert => {
    assert.throws(() => req1.setHeader('Content-Type', 'text/plain'),
      'should not allow header set with uppercase characters')

    assert.throws(() => req1.setHeader(Symbol(), 'invalid'),
      'should not allow non-string header name')

    assert.throws(() => req1.setHeader('content-type', null),
      'should not allow non-string header value')

    assert.throws(() => req1.setHeader(':pseudo-header', 'value'),
      'should not allow invalid character in header name')

    assert.throws(() => req1.setHeader('content-type', 'text/plain\n'),
      'should not allow non-printable character in header value')

    assert.throws(() => req1.setHeader('content-type', '中文'),
      'should not allow unicode character in header value')

    assert.end()
  })

  assert.test('request path', assert => {
    assert.notOk(req1.path)
    const req2 = req1.setPath('/api/foo?key=value&arg=hello%20world%0A')

    assert.equal(req2.path, '/api/foo?key=value&arg=hello%20world%0A')
    assert.equal(req2.pathname, '/api/foo')
    assert.equal(req2.search, '?key=value&arg=hello%20world%0A')

    const query1 = req2.query
    assert.equal(query1.get('key'), 'value')
    assert.equal(query1.get('arg'), 'hello world\n')

    assert.notOk(query1.get('bar'))

    const query2 = query1.set('bar', 'baz')
    assert.equal(query2.get('bar'), 'baz')
    assert.notOk(query1.get('bar'))

    const req3 = req2.setQueryKey('bar', 'baz')
    assert.equal(req3.path, '/api/foo?key=value&arg=hello%20world%0A&bar=baz')
    assert.equal(req2.path, '/api/foo?key=value&arg=hello%20world%0A')
    assert.notOk(req2.query.get('bar'))

    assert.throws(() => req2.setQueryKey('object-value', {}),
      'should not allow setting non string to query')

    assert.end()
  })

  assert.test('request authority', assert => {
    assert.notOk(req1.authority)

    const req2 = req1.setAuthority('example.com:8080')
    assert.equal(req2.authority, 'example.com:8080')
    assert.notOk(req1.authority)

    assert.equal(req2.hostname, 'example.com')
    assert.equal(req2.port, '8080')

    const req3 = req2.setPort(80)
    assert.equal(req3.port, '80')
    assert.notEqual(req3.port, 80)
    assert.equal(req2.port, '8080')
    assert.equal(req3.authority, 'example.com:80')

    const req4 = req1.setAuthority('example.org')
    assert.equal(req4.hostname, 'example.org')
    assert.notOk(req4.port)

    const req5 = req4.setHostname('other.com')
    assert.equal(req5.authority, 'other.com')
    assert.equal(req4.authority, 'example.org')
    assert.notOk(req5.port)

    assert.end()
  })

  assert.end()
})
