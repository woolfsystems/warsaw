var BaseError = require('./baseError');

function UnavailableForLegalReasons() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, UnavailableForLegalReasons);
}
UnavailableForLegalReasons.prototype = Object.create(BaseError.prototype);
UnavailableForLegalReasons.prototype.constructor = UnavailableForLegalReasons;
UnavailableForLegalReasons.prototype.code = 451;

module.exports = UnavailableForLegalReasons;
