var BaseError = require('./baseError');

function UpgradeRequired() {
    BaseError.apply(this, arguments);
    Error.captureStackTrace(this, UpgradeRequired);
}
UpgradeRequired.prototype = Object.create(BaseError.prototype);
UpgradeRequired.prototype.constructor = UpgradeRequired;
UpgradeRequired.prototype.code = 426;

module.exports = UpgradeRequired;
