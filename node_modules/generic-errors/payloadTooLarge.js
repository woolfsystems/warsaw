var BaseError = require('./baseError');

function PayloadTooLarge() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, PayloadTooLarge);
}
PayloadTooLarge.prototype = Object.create(BaseError.prototype);
PayloadTooLarge.prototype.constructor = PayloadTooLarge;
PayloadTooLarge.prototype.code = 413;

module.exports = PayloadTooLarge;
