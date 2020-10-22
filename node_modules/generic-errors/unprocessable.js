var BaseError = require('./baseError');

function Unprocessable(){
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, Unprocessable);
}
Unprocessable.prototype = Object.create(BaseError.prototype);
Unprocessable.prototype.constructor = Unprocessable;
Unprocessable.prototype.code = 422;

module.exports = Unprocessable;