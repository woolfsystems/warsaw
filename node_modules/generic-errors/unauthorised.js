var BaseError = require('./baseError');

function Unauthorised(){
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, Unauthorised);
}
Unauthorised.prototype = Object.create(BaseError.prototype);
Unauthorised.prototype.constructor = Unauthorised;
Unauthorised.prototype.code = 401;

module.exports = Unauthorised;