var BaseError = require('./baseError');

function RangeNotSatisfiable() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, RangeNotSatisfiable);
}
RangeNotSatisfiable.prototype = Object.create(BaseError.prototype);
RangeNotSatisfiable.prototype.constructor = RangeNotSatisfiable;
RangeNotSatisfiable.prototype.code = 416;

module.exports = RangeNotSatisfiable;
