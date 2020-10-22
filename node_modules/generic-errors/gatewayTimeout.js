var BaseError = require('./baseError');

function GatewayTimeout() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, GatewayTimeout);
}
GatewayTimeout.prototype = Object.create(BaseError.prototype);
GatewayTimeout.prototype.constructor = GatewayTimeout;
GatewayTimeout.prototype.code = 504;

module.exports = GatewayTimeout;
