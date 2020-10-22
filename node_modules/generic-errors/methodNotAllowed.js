var BaseError = require('./baseError');

function MethodNotAllowed() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, MethodNotAllowed);
}
MethodNotAllowed.prototype = Object.create(BaseError.prototype);
MethodNotAllowed.prototype.constructor = MethodNotAllowed;
MethodNotAllowed.prototype.code = 405;

module.exports = MethodNotAllowed;
