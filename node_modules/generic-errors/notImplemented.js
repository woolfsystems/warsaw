var BaseError = require('./baseError');

function NotImplemented() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, NotImplemented);
}
NotImplemented.prototype = Object.create(BaseError.prototype);
NotImplemented.prototype.constructor = NotImplemented;
NotImplemented.prototype.code = 501;

module.exports = NotImplemented;
