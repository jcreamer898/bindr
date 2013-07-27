/*! bindr - v0.0.1 - 2013-07-27
* Copyright (c) 2013 ; Licensed  */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.bindr = factory();
  }
}(this, function () {

// ### Bindr
// The constructor for the injection container.
function Bindr() {
    // Save all of the injections.
    this.injections = {};
}

// Pass in a key and a constructor. Anytime a property is 
// set on an object with `key`, it will get set to a new `to`
// 
//      bindr.bind('service', Service);
Bindr.prototype.bind = function(from, to) {
    this.injections[from] = to;
    return this;
};

// Process all of the incoming arguments to a function and inject 
// the functions dependencies.
Bindr.prototype.run = function(obj) {        
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop) && this.injections[prop]) {
            obj[prop] = new this.injections[prop]();
        }
    }
};

// Create a local instance of `Bindr`.
var _bindr = new Bindr();

// Return this function to the window. This allows for aliasing `Bindr.run` to just `bindr()`.
// 
//      bindr(this, arguments);
var bindr = function() {
    if (arguments.length === 2) {
        return _bindr.run.apply(_bindr, arguments);
    }
    
    return this;
};

// Setup an API for the `bind` method.
bindr.bind = _bindr.bind.bind(_bindr);

return bindr;

}));