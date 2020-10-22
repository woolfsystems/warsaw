var BaseError = require('./baseError');

function TooEarly() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, TooEarly);
}
TooEarly.prototype = Object.create(BaseError.prototype);
TooEarly.prototype.constructor = TooEarly;
TooEarly.prototype.code = 425;

module.exports = TooEarly;
