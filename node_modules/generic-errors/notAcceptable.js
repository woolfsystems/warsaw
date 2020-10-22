var BaseError = require('./baseError');

function NotAcceptable() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, NotAcceptable);
}
NotAcceptable.prototype = Object.create(BaseError.prototype);
NotAcceptable.prototype.constructor = NotAcceptable;
NotAcceptable.prototype.code = 406;

module.exports = NotAcceptable;
