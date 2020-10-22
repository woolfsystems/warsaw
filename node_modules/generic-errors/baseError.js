function BaseError(data){
    var oldLimit = Error.stackTraceLimit,
        error;

    Error.stackTraceLimit = 20;

    error = Error.apply(this, arguments);

    Error.stackTraceLimit = oldLimit;

    if(Error.captureStackTrace){
        Error.captureStackTrace(this, BaseError);
    }

    this.__genericError = true;

    if(typeof data === 'string'){
        this.message = data;
    } else {
        for(var key in data){
            this[key] = data[key];
        }

        if(!this.message && data && data.message){
            this.message = data.message;
        }
    }

    if(!this.message){
        this.message = this.toString();
    }
}
BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.constructor = BaseError;
BaseError.prototype.toString = function(){
    return this.message || this.code + ': ' + this.constructor.name;
};
BaseError.prototype.valueOf = function(){
    return this;
};
BaseError.prototype.toJSON = function() {
    var result = {};

    for(var key in this)
    {
        if(typeof this[key] !== 'function')
            result[key] = this[key];
    }

    return result;
};
BaseError.prototype.code = 500;
BaseError.isGenericError = function(obj){
    return obj instanceof BaseError || (obj != null && obj.__genericError);
};

module.exports = BaseError;