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

var create = (function () {
    function Factory(constructor, args) {
        return constructor.apply(this, args);
    }

    return function() {
        Factory.prototype = this.prototype;
        return new Factory(this, arguments);
    };
}());

// ### Injection
// A class for new injections to allow for a fluent API.
function Injection(from, dependency) {
    this.from = from;
    this.dependency = dependency;
}

// FluentApi for binding to a constructor.
// 
//      bindr.bind('service').to(Service);
Injection.prototype.to = function(dependency) {
    this.dependency = dependency;
    return this;
};

// FluentApi for adding arguments to a dependency injection
// 
//      bindr.bind('service').to(Service).withArgs('foo', 'bar');
//      bindr.bind('service').to(Service).withArgs(['foo', 'bar']);
Injection.prototype.withArgs = function(args) {
    this.args = typeof args === 'array' ? args : Array.prototype.splice.call(arguments, 0);
    return this;
};

// ### Bindr
// The constructor for the injection container.
function Bindr() {
    this.rARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

    // Save all of the injections.
    this.injections = {};
}

// Pass in a key and a constructor. Anytime a property is 
// set on an object with `key`, it will get set to a new `dependency`
// 
//      bindr.bind('service', Service);
Bindr.prototype.bind = function(from, dependency) {
    this.injections[from] = new Injection(from, dependency);
    return this.injections[from];
};

// Process all of the incoming arguments to a function and inject 
// the functions dependencies.
Bindr.prototype.run = function(obj) {
    var args = this.getArgs(obj);

    for(var prop in obj) {
        if((obj.hasOwnProperty(prop) || args[prop]) && this.injections[prop]) {
            obj[prop] = create.apply(this.injections[prop].dependency, this.injections[prop].args);
        }
    }
};

Bindr.prototype.getArgs = function(obj) {
    var args = {},
        ctor = Object.getPrototypeOf(obj).constructor.toString(),
        matches = [];

    matches = ctor.match(this.rARGS);

    matches.forEach(function() {
        
    });

    return args;
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