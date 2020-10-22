var test = require('tape'),
    errors = require('../');

function testDeflateInflate(t, error, name, expecedString) {
    var originalString = JSON.stringify(error),
        inflatedError = new errors[error.code](JSON.parse(originalString)),
        newString = JSON.stringify(inflatedError);

    t.equal(JSON.stringify(error), expecedString, name + ' stringifys correctly');

    t.equal(originalString, newString, name + ' serialises correctly');
}

function testErrorSetup(ErrorConstructor, name) {
    var error = new ErrorConstructor(),
        fileName = ErrorConstructor.name.substring(0, 1).toLowerCase() + ErrorConstructor.name.substring(1) + '.js';

    test('check ' + name + ' passes instanceof', function (t) {
        t.plan(3);
        t.ok(error instanceof Error, name + ' is instance of Error');
        t.ok(error instanceof errors.BaseError, name + ' is instance of BaseError');
        t.ok(error instanceof ErrorConstructor, name + ' is instance of ' + ErrorConstructor.name);
    });

    test('check ' + name + ' passes isGenericError', function (t) {
        t.plan(2);
        t.ok(errors.BaseError.isGenericError(error), name + ' is a GenericError');
        t.ok(
            errors.BaseError.isGenericError(JSON.parse(JSON.stringify(error))),
            name + ' is a GenericError after serialization',
        );
    });

    test('check ' + name + ' has truncated stack correctly', function (t) {
        t.plan(2);
        t.ok(error.stack, name + ' has a stack');
        t.notOk(~error.stack.indexOf(fileName), name + ' stack trace should be trimmed');
    });

    test('check ' + name + ' has correct message and valueOf', function (t) {
        t.plan(3);
        t.equal(
            error.message,
            ErrorConstructor.prototype.code + ': ' + ErrorConstructor.name,
            name + ' message defaulted correctly',
        );
        t.equal(
            error.toString(),
            ErrorConstructor.prototype.code + ': ' + ErrorConstructor.name,
            name + ' toString is set correctly',
        );
        t.equal(error.valueOf(), error, name + ' valueOf returns the instance');
    });

    test('check ' + name + ' has codes setup correctly', function (t) {
        t.plan(3);
        t.ok(error.code, name + ' has a code: ' + error.code);
        t.equal(error.code, ErrorConstructor.prototype.code, name + ' has correct code');
        t.equal(errors[ErrorConstructor.prototype.code], ErrorConstructor, name + ' has constructor exposed as code');
    });
}

function testSerialisation(ErrorConstructor, name) {
    var testMessage = 'TEST ERROR',
        testData = { foo: 'bar' },
        testDataWithMessage = { things: 'stuff', message: 'majigger' },
        error = new ErrorConstructor(),
        errorWithMessage = new ErrorConstructor(testMessage),
        errorWithData = new ErrorConstructor(testData),
        errorWithDataAndMessage = new ErrorConstructor(testDataWithMessage);

    test('check ' + name + ' serialises correctly without parameters', function (t) {
        t.plan(2);
        testDeflateInflate(
            t,
            error,
            name,
            '{"__genericError":true,"message":"' +
                error.toString() +
                '","code":' +
                ErrorConstructor.prototype.code +
                '}',
        );
    });

    test('check ' + name + ' serialises correctly with a message', function (t) {
        t.plan(4);

        t.equal(errorWithMessage.message, testMessage, name + ' message set correctly');
        t.equal(errorWithMessage.toString(), testMessage, name + ' toString correctly returns message');

        testDeflateInflate(
            t,
            errorWithMessage,
            name,
            '{"__genericError":true,"message":"' + testMessage + '","code":' + ErrorConstructor.prototype.code + '}',
        );
    });

    test('check ' + name + ' serialises correctly with data and default message', function (t) {
        t.plan(4);

        t.equal(errorWithData.message, error.toString(), name + ' message set correctly with data and default message');
        t.equal(
            errorWithData.toString(),
            ErrorConstructor.prototype.code + ': ' + ErrorConstructor.name,
            name + ' toString returns correct message with data and default message',
        );

        testDeflateInflate(
            t,
            errorWithData,
            name,
            '{"__genericError":true,"foo":"bar","message":"' +
                error.toString() +
                '","code":' +
                ErrorConstructor.prototype.code +
                '}',
        );
    });

    test('check ' + name + ' serialises correctly with data and message', function (t) {
        t.plan(4);

        t.equal(
            errorWithDataAndMessage.message,
            testDataWithMessage.message,
            name + ' message set correctly with data and message',
        );
        t.equal(
            errorWithDataAndMessage.toString(),
            testDataWithMessage.message,
            name + ' toString returns correct message with data and message',
        );

        testDeflateInflate(
            t,
            errorWithDataAndMessage,
            name,
            '{"__genericError":true,"things":"stuff","message":"' +
                testDataWithMessage.message +
                '","code":' +
                ErrorConstructor.prototype.code +
                '}',
        );
    });
}

function runErrorTests(ErrorConstructor, name) {
    testErrorSetup(ErrorConstructor, name);
    testSerialisation(ErrorConstructor, name);
}

for (var key in errors) {
    if (isNaN(key)) {
        runErrorTests(errors[key], key);
    }
}

test('codes are correct', (t) => {
    t.plan(34);
    t.equal(errors.BaseError.prototype.code, 500, 'BaseError has correct code');
    t.equal(errors.BadRequest.prototype.code, 400, 'BadRequest has correct code');
    t.equal(errors.Unauthorised.prototype.code, 401, 'Unauthorised has correct code');
    t.equal(errors.Forbidden.prototype.code, 403, 'Forbidden has correct code');
    t.equal(errors.NotFound.prototype.code, 404, 'NotFound has correct code');
    t.equal(errors.MethodNotAllowed.prototype.code, 405, 'MethodNotAllowed has correct code');
    t.equal(errors.NotAcceptable.prototype.code, 406, 'NotAcceptable has correct code');
    t.equal(errors.ProxyAuthenticationRequired.prototype.code, 407, 'ProxyAuthenticationRequired has correct code');
    t.equal(errors.RequestTimeout.prototype.code, 408, 'RequestTimeout has correct code');
    t.equal(errors.Conflict.prototype.code, 409, 'Conflict has correct code');
    t.equal(errors.Gone.prototype.code, 410, 'Gone has correct code');
    t.equal(errors.LengthRequired.prototype.code, 411, 'LengthRequired has correct code');
    t.equal(errors.PreconditionFailed.prototype.code, 412, 'PreconditionFailed has correct code');
    t.equal(errors.PayloadTooLarge.prototype.code, 413, 'PayloadTooLarge has correct code');
    t.equal(errors.URITooLong.prototype.code, 414, 'URITooLong has correct code');
    t.equal(errors.UnsupportedMediaType.prototype.code, 415, 'UnsupportedMediaType has correct code');
    t.equal(errors.RangeNotSatisfiable.prototype.code, 416, 'RangeNotSatisfiable has correct code');
    t.equal(errors.ExpectationFailed.prototype.code, 417, 'ExpectationFailed has correct code');
    t.equal(errors.Teapot.prototype.code, 418, 'Teapot has correct code');
    t.equal(errors.Unprocessable.prototype.code, 422, 'Unprocessable has correct code');
    t.equal(errors.TooEarly.prototype.code, 425, 'TooEarly has correct code');
    t.equal(errors.UpgradeRequired.prototype.code, 426, 'UpgradeRequired has correct code');
    t.equal(errors.PreconditionRequired.prototype.code, 428, 'PreconditionRequired has correct code');
    t.equal(errors.TooManyRequests.prototype.code, 429, 'TooManyRequests has correct code');
    t.equal(errors.RequestHeaderFieldsTooLarge.prototype.code, 431, 'RequestHeaderFieldsTooLarge has correct code');
    t.equal(errors.UnavailableForLegalReasons.prototype.code, 451, 'UnavailableForLegalReasons has correct code');
    t.equal(errors.NotImplemented.prototype.code, 501, 'NotImplemented has correct code');
    t.equal(errors.BadGateway.prototype.code, 502, 'BadGateway has correct code');
    t.equal(errors.ServiceUnavailable.prototype.code, 503, 'ServiceUnavailable has correct code');
    t.equal(errors.GatewayTimeout.prototype.code, 504, 'GatewayTimeout has correct code');
    t.equal(errors.HTTPVersionNotSupported.prototype.code, 505, 'HTTPVersionNotSupported has correct code');
    t.equal(errors.VariantAlsoNegotiates.prototype.code, 506, 'VariantAlsoNegotiates has correct code');
    t.equal(errors.NotExtended.prototype.code, 510, 'NotExtended has correct code');
    t.equal(errors.NetworkAuthenticationRequired.prototype.code, 511, 'NetworkAuthenticationRequired has correct code');
});
