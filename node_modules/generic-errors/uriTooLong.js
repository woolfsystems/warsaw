var BaseError = require('./baseError');

function URITooLong() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, URITooLong);
}
URITooLong.prototype = Object.create(BaseError.prototype);
URITooLong.prototype.constructor = URITooLong;
URITooLong.prototype.code = 414;

module.exports = URITooLong;
