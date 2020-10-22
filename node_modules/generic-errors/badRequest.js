var BaseError = require('./baseError');

function BadRequest() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, BadRequest);
}
BadRequest.prototype = Object.create(BaseError.prototype);
BadRequest.prototype.constructor = BadRequest;
BadRequest.prototype.code = 400;

module.exports = BadRequest;
