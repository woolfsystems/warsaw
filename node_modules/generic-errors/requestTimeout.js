var BaseError = require('./baseError');

function RequestTimeout() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, RequestTimeout);
}
RequestTimeout.prototype = Object.create(BaseError.prototype);
RequestTimeout.prototype.constructor = RequestTimeout;
RequestTimeout.prototype.code = 408;

module.exports = RequestTimeout;
