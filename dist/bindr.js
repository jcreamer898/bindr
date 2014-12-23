/*! bindr - v0.0.1 - 2014-12-23
* Copyright (c) 2014 ; Licensed  */
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
    // Save all of the injections.
    this.injections = {};
}

// Pass in a key and a constructor. Anytime a property is 
// set on an object with `key`, it will get set to a new `dependency`
// 
//      bindr.bind('service', Service);
Bindr.prototype.bind = function(from, dependency) {
    var injection;

    if (typeof from === "object") {
        for(injection in from) {
            if (from.hasOwnProperty(injection)) {
                this.injections[injection] = new Injection(injection, from[injection]);
            }
        }
        return;
    }

    this.injections[from] = new Injection(from, dependency);
    return this.injections[from];
};

// Process all of the incoming arguments to a function and inject 
// the functions dependencies.
Bindr.prototype.run = function(obj, args) {
    var dependency, i, 
        name =  Object.getPrototypeOf(obj).constructor.name;
    
    for(i = 0; i < obj.$binder.constructorArgs.length; i++) {
        dependency = obj.$binder.deps[i];
        
        if(this.injections[dependency]) {
            Array.prototype.splice.call(args, i, 0, create.apply(
                this.injections[dependency].dependency, 
                this.injections[dependency].args
            ));

            obj.$binder.dependsOn.push(dependency);
            dependencyGraph[name] = dependencyGraph[name] || {};
            dependencyGraph[name][dependency] = dependencyGraph[name][dependency] || 
                dependencyGraph[this.injections[dependency].dependency.prototype.constructor.name] || {};
        }
    }
};

var rArgs = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

var dependencyGraph = {};

// Setup a constructor for DI
Bindr.prototype.setupConstructor = function(fn, deps) {
    var Injectable = function Injectable() {
        _bindr.run(this, arguments);

        Injectable.prototype.constructor.apply(this, arguments);
    };

    var matches = rArgs.exec(fn.toString()),
        constructorArgs;

    if (matches.length) {
        constructorArgs = matches[1].split(",");
    }

    Injectable.prototype.constructor = fn;
    Injectable.prototype.$binder = {
        name: fn.prototype.constructor.name,
        deps: deps,
        constructorArgs: constructorArgs,
        dependsOn: []
    };

    return Injectable;
};

Bindr.prototype.trace = function(name) {
    if (typeof name === "object") {
        name = Object.getPrototypeOf(name).constructor.name;
        return dependencyGraph[name];
    }

    return dependencyGraph;
};

Bindr.prototype.reset = function() {
    this.injections = {};
    dependencyGraph = {};
};

// Create a local instance of `Bindr`.
var _bindr = new Bindr();

// Return this function to the window. This allows for aliasing `Bindr.setupConstructor` to just `bindr()`.
// 
//      bindr(this, arguments);
var bindr = function() {
    if (arguments.length === 2) {
        return _bindr.setupConstructor.apply(_bindr, arguments);
    }

    return this;
};

// Setup an API for the `bind` method.
bindr.bind = _bindr.bind.bind(_bindr);
bindr.trace = _bindr.trace.bind(_bindr);
bindr.reset = _bindr.reset.bind(_bindr);

return bindr;

}));