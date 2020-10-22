var BaseError = require('./baseError');

function ExpectationFailed() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, ExpectationFailed);
}
ExpectationFailed.prototype = Object.create(BaseError.prototype);
ExpectationFailed.prototype.constructor = ExpectationFailed;
ExpectationFailed.prototype.code = 417;

module.exports = ExpectationFailed;
