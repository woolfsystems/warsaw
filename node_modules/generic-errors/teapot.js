var BaseError = require('./baseError');

function Teapot(){
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, Teapot);
}
Teapot.prototype = Object.create(BaseError.prototype);
Teapot.prototype.constructor = Teapot;
Teapot.prototype.code = 418;

module.exports = Teapot;