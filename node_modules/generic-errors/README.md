# generic-errors

Generic error constructors with common http codes.

Also doesn't pollute the stack with its own depth.

## Usage

Install:

```
npm install generic-errors
```

Require the errors:

```JavaScript
const errors = require('generic-errors');
```

Use an error:

```JavaScript
const notFound = new errors.NotFound('Could not find the thing');
```

Add additional Properties to the error

```JavaScript
const unprocessable = new errors.Unprocessable({ message: 'Cant Process', fields: ['foo', bar] });
```

## Available constructors:

```
BaseError                       // 500 Use to make custom errors, easier to inherit from than Error
BadRequest                      // 400
Unauthorised                    // 401
Forbidden                       // 403
NotFound                        // 404
MethodNotAllowed                // 405
NotAcceptable                   // 406
ProxyAuthenticationRequired     // 407
RequestTimeout                  // 408
Conflict                        // 409
Gone                            // 410
LengthRequired                  // 411
PreconditionFailed              // 412
PayloadTooLarge                 // 413
URITooLong                      // 414
UnsupportedMediaType            // 415
RangeNotSatisfiable             // 416
ExpectationFailed               // 417
Teapot                          // 418
Unprocessable                   // 422
TooEarly                        // 425
UpgradeRequired                 // 426
PreconditionRequired            // 428
TooManyRequests                 // 429
RequestHeaderFieldsTooLarge     // 431
UnavailableForLegalReasons      // 451
NotImplemented                  // 501
BadGateway                      // 502
ServiceUnavailable              // 503
GatewayTimeout                  // 504
HTTPVersionNotSupported         // 505
VariantAlsoNegotiates           // 506
NotExtended                     // 510
NetworkAuthenticationRequired   // 511
```

## Detection

After serialization Generic Errors can still be detected using the `isGenericError` function attacted to the BaseError constructor.

```JavaScript
    const notFound = new errors.NotFound();
    const serializedError = JSON.parse(JSON.stringify(notFound));

    errors.BaseError.isGenericError(serializedError);  // true
```
