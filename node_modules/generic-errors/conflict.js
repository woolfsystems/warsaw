var BaseError = require('./baseError');

function Conflict(){
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, Conflict);
}
Conflict.prototype = Object.create(BaseError.prototype);
Conflict.prototype.constructor = Conflict;
Conflict.prototype.code = 409;

module.exports = Conflict;
