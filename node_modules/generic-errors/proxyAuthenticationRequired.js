var BaseError = require('./baseError');

function ProxyAuthenticationRequired() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, ProxyAuthenticationRequired);
}
ProxyAuthenticationRequired.prototype = Object.create(BaseError.prototype);
ProxyAuthenticationRequired.prototype.constructor = ProxyAuthenticationRequired;
ProxyAuthenticationRequired.prototype.code = 407;

module.exports = ProxyAuthenticationRequired;
