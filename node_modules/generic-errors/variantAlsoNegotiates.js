var BaseError = require('./baseError');

function VariantAlsoNegotiates() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, VariantAlsoNegotiates);
}
VariantAlsoNegotiates.prototype = Object.create(BaseError.prototype);
VariantAlsoNegotiates.prototype.constructor = VariantAlsoNegotiates;
VariantAlsoNegotiates.prototype.code = 506;

module.exports = VariantAlsoNegotiates;
