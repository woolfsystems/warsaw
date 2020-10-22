var BaseError = require('./baseError');

function RequestHeaderFieldsTooLarge() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, RequestHeaderFieldsTooLarge);
}
RequestHeaderFieldsTooLarge.prototype = Object.create(BaseError.prototype);
RequestHeaderFieldsTooLarge.prototype.constructor = RequestHeaderFieldsTooLarge;
RequestHeaderFieldsTooLarge.prototype.code = 431;

module.exports = RequestHeaderFieldsTooLarge;
