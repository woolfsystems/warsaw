var BaseError = require('./baseError');

function BadGateway() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, BadGateway);
}
BadGateway.prototype = Object.create(BaseError.prototype);
BadGateway.prototype.constructor = BadGateway;
BadGateway.prototype.code = 502;

module.exports = BadGateway;
