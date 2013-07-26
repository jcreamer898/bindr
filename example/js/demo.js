function Model() {
    bindr(this, arguments);
}

function Car(make, model, color, service) {
    this.make = make;
    this.model = model;
    this.color = color;
    this.service = service;
    
    bindr(this, arguments);
}

function Service() {}
function FakeService() {}

bindr.bind('service', FakeService);

var ford = new Car('Ford', 'Fusion', 'Maroon');

document.getElementById('car').innerHTML = JSON.stringify(ford, null, 4);