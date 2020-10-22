var BaseError = require('./baseError');

function Forbidden(){
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, Forbidden);
}
Forbidden.prototype = Object.create(BaseError.prototype);
Forbidden.prototype.constructor = Forbidden;
Forbidden.prototype.code = 403;

module.exports = Forbidden;