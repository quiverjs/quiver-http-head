export const mixinCreateHeadMethod = (RequestHead, ResponseHead) => {
  const createRequestHead = () => new RequestHead()
  const createResponseHead = () => new ResponseHead()

  RequestHead.prototype.createRequestHead = createRequestHead
  RequestHead.prototype.createResponseHead = createResponseHead

  ResponseHead.prototype.createRequestHead = createRequestHead
  ResponseHead.prototype.createResponseHead = createResponseHead
}
