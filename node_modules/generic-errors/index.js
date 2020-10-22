var constructors = {
    BaseError: require('./baseError'),
    BadRequest: require('./badRequest'),
    Unauthorised: require('./unauthorised'),
    Forbidden: require('./forbidden'),
    NotFound: require('./notFound'),
    MethodNotAllowed: require('./methodNotAllowed'),
    NotAcceptable: require('./notAcceptable'),
    ProxyAuthenticationRequired: require('./proxyAuthenticationRequired'),
    RequestTimeout: require('./requestTimeout'),
    Conflict: require('./conflict'),
    Gone: require('./gone'),
    LengthRequired: require('./lengthRequired'),
    PreconditionFailed: require('./preconditionFailed'),
    PayloadTooLarge: require('./payloadTooLarge'),
    URITooLong: require('./uriTooLong'),
    UnsupportedMediaType: require('./unsupportedMediaType'),
    RangeNotSatisfiable: require('./rangeNotSatisfiable'),
    ExpectationFailed: require('./expectationFailed'),
    Teapot: require('./teapot'),
    Unprocessable: require('./unprocessable'),
    TooEarly: require('./tooEarly'),
    UpgradeRequired: require('./upgradeRequired'),
    PreconditionRequired: require('./preconditionRequired'),
    TooManyRequests: require('./tooManyRequests'),
    RequestHeaderFieldsTooLarge: require('./requestHeaderFieldsTooLarge'),
    UnavailableForLegalReasons: require('./unavailableForLegalReasons'),
    NotImplemented: require('./notImplemented'),
    BadGateway: require('./badGateway'),
    ServiceUnavailable: require('./serviceUnavailable'),
    GatewayTimeout: require('./gatewayTimeout'),
    HTTPVersionNotSupported: require('./httpVersionNotSupported'),
    VariantAlsoNegotiates: require('./variantAlsoNegotiates'),
    NotExtended: require('./notExtended'),
    NetworkAuthenticationRequired: require('./networkAuthenticationRequired'),
};

for (var key in constructors) {
    constructors[constructors[key].prototype.code] = constructors[key];
}

module.exports = constructors;
