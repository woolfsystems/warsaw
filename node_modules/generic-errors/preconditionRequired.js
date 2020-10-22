var BaseError = require('./baseError');

function PreconditionRequired() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, PreconditionRequired);
}
PreconditionRequired.prototype = Object.create(BaseError.prototype);
PreconditionRequired.prototype.constructor = PreconditionRequired;
PreconditionRequired.prototype.code = 428;

module.exports = PreconditionRequired;
