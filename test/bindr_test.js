var bindr = require('../lib/bindr.js');

exports.testSomething = function(test){
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