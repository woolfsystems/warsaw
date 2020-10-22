var BaseError = require('./baseError');

function NotFound(){
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, NotFound);
}
NotFound.prototype = Object.create(BaseError.prototype);
NotFound.prototype.constructor = NotFound;
NotFound.prototype.code = 404;

module.exports = NotFound;