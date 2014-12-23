/* jshint -W021, -W103 */

var bindr = require('../lib/bindr.js');

exports.whenBindingDependencies = function(test){
    function Car(make, model, color, service) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.service = service;
    }

    function FakeService() {}

    bindr.bind('service', FakeService);
    Car = bindr(Car, [null, null, null, 'service']);

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
    }

    function Service() {}

    bindr.bind('service').to(Service);
    Car = bindr(Car, [null, null, null, 'service']);

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
    }

    function Service(foo, bar) {
        this.foo = foo;
        this.bar = bar;
    }

    bindr.bind('service').to(Service).withArgs('foo', 'bar');
    Car = bindr(Car, [null, null, null, 'service']);

    var ford = new Car('Ford', 'Fusion', 'Maroon');
    
    test.expect(2);
    test.equal(ford.service.foo, 'foo', 'should pass foo argument to dependency constructor');
    test.equal(ford.service.bar, 'bar', 'should pass bar argument to dependency constructor');
    test.done();
};

exports.whenBindingWithAnObject = function(test) {
    function Car(make, model, color, service) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.service = service;
    }

    function FakeService() {}

    bindr.bind({
        'service': FakeService
    });

    Car = bindr(Car, [null, null, null, 'service']);

    var ford = new Car('Ford', 'Fusion', 'Maroon');
    
    test.expect(2);
    test.ok(ford.service, "the service should be injected");
    test.ok(ford.service instanceof FakeService, 'should set the service up correctly');
    test.done();
};

exports.whenCallingTrace = function(test) {
    bindr.reset();

    function Car(engine, dashboard) {
        this.engine = engine;
        this.dashboard = dashboard;
    }
    function Engine() {}
    function Dashboard(ac, radio) {
        this.ac = ac;
        this.radio = radio;
    }
    function Ac () {}
    function Radio () {}

    Car = bindr(Car, ['engine', 'dashboard']);
    Dashboard = bindr(Dashboard, ['ac', 'radio']);

    bindr.bind({
        'engine': Engine,
        'dashboard': Dashboard,
        'ac': Ac,
        'radio': Radio
    });

    var car = new Car();

    test.ok(bindr.trace(car).dashboard.ac);
    test.ok(bindr.trace().Car);
    test.done();
};