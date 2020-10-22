var BaseError = require('./baseError');

function TooManyRequests() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, TooManyRequests);
}
TooManyRequests.prototype = Object.create(BaseError.prototype);
TooManyRequests.prototype.constructor = TooManyRequests;
TooManyRequests.prototype.code = 429;

module.exports = TooManyRequests;
