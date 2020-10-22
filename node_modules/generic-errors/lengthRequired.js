var BaseError = require('./baseError');

function LengthRequired() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, LengthRequired);
}
LengthRequired.prototype = Object.create(BaseError.prototype);
LengthRequired.prototype.constructor = LengthRequired;
LengthRequired.prototype.code = 411;

module.exports = LengthRequired;
