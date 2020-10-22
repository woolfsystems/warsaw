var BaseError = require('./baseError');

function ServiceUnavailable() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, ServiceUnavailable);
}
ServiceUnavailable.prototype = Object.create(BaseError.prototype);
ServiceUnavailable.prototype.constructor = ServiceUnavailable;
ServiceUnavailable.prototype.code = 503;

module.exports = ServiceUnavailable;
