var BaseError = require('./baseError');

function HTTPVersionNotSupported() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, HTTPVersionNotSupported);
}
HTTPVersionNotSupported.prototype = Object.create(BaseError.prototype);
HTTPVersionNotSupported.prototype.constructor = HTTPVersionNotSupported;
HTTPVersionNotSupported.prototype.code = 505;

module.exports = HTTPVersionNotSupported;
