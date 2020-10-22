var BaseError = require('./baseError');

function PreconditionFailed(){
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, PreconditionFailed);
}
PreconditionFailed.prototype = Object.create(BaseError.prototype);
PreconditionFailed.prototype.constructor = PreconditionFailed;
PreconditionFailed.prototype.code = 412;

module.exports = PreconditionFailed;