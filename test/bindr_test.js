var bindr = require('../lib/bindr.js');

exports.whenBindingDependencies = function(test){
    function Car(make, model, color, service) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.service = service;
        
        bindr(this, arguments);
    }

    function FakeService() {}

    bindr.bind('service', FakeService);

    var ford = new Car('Ford', 'Fusion', 'Maroon');
    
    test.expect(3);
    test.ok(ford.service, "the service should be injected");
    test.ok(ford.service instanceof FakeService, 'should set the service up correctly');
    test.ok(bindr);
    test.done();
};

exports.whenBindingDependenciesWithFluentApi = function(test) {
    function Car(make, model, color, service) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.service = service;
        
        bindr(this, arguments);
    }

    function Service() {}

    bindr.bind('service').to(Service);

    var ford = new Car('Ford', 'Fusion', 'Maroon');
    
    test.expect(3);
    test.ok(ford.service, "the service should be injected");
    test.ok(ford.service instanceof Service, 'should set the service up correctly');
    test.ok(bindr);
    test.done();
};

exports.whenBindingDependenciesWithFluentApiArgs = function(test) {
    function Car(make, model, color, service) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.service = service;
        
        bindr(this, arguments);
    }

    function Service(foo, bar) {
        this.foo = foo;
        this.bar = bar;
    }

    bindr.bind('service').to(Service).withArgs('foo', 'bar');

    var ford = new Car('Ford', 'Fusion', 'Maroon');
    
    test.expect(2);
    test.equal(ford.service.foo, 'foo', 'should pass foo argument to dependency constructor');
    test.equal(ford.service.bar, 'bar', 'should pass bar argument to dependency constructor');
    test.done();
};

exports.whenSettingArgDependencies = function(test) {
    function Car(make, model, color, service) {
        this.make = make;
        this.model = model;
        this.color = color;
        service.foo();
    }

    function Service() {
        
        this.foo = function() {

        };
    }

    bindr.bind('service').to(Service).asArgument();

    var ford = new Car('Ford', 'Fusion', 'Maroon');
    
    test.expect(2);
    test.equal(ford.service.foo, 'foo', 'should pass foo argument to dependency constructor');
    test.equal(ford.service.bar, 'bar', 'should pass bar argument to dependency constructor');
    test.done();
};