var BaseError = require('./baseError');

function NetworkAuthenticationRequired() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, NetworkAuthenticationRequired);
}
NetworkAuthenticationRequired.prototype = Object.create(BaseError.prototype);
NetworkAuthenticationRequired.prototype.constructor = NetworkAuthenticationRequired;
NetworkAuthenticationRequired.prototype.code = 511;

module.exports = NetworkAuthenticationRequired;
