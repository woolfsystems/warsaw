var BaseError = require('./baseError');

function Gone() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, Gone);
}
Gone.prototype = Object.create(BaseError.prototype);
Gone.prototype.constructor = Gone;
Gone.prototype.code = 410;

module.exports = Gone;
