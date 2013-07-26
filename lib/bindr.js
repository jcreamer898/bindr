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

function Bindr() {
    this.injections = {};
}

Bindr.prototype.bind = function(from, to) {
    this.injections[from] = to;
    return this;
};
    
Bindr.prototype.run = function(obj) {        
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop) && this.injections[prop]) {
            obj[prop] = new this.injections[prop]();
        }
    }
};

var _bindr = new Bindr();

var bindr = function() {
    if (arguments.length === 2) {
        return _bindr.run.apply(_bindr, arguments);
    }
    
    return this;
};

bindr.bind = _bindr.bind.bind(_bindr);

return bindr;

}));