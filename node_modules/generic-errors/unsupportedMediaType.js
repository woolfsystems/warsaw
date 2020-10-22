var BaseError = require('./baseError');

function UnsupportedMediaType() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, UnsupportedMediaType);
}
UnsupportedMediaType.prototype = Object.create(BaseError.prototype);
UnsupportedMediaType.prototype.constructor = UnsupportedMediaType;
UnsupportedMediaType.prototype.code = 415;

module.exports = UnsupportedMediaType;
