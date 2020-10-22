var BaseError = require('./baseError');

function NotExtended() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, NotExtended);
}
NotExtended.prototype = Object.create(BaseError.prototype);
NotExtended.prototype.constructor = NotExtended;
NotExtended.prototype.code = 510;

module.exports = NotExtended;
