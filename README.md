bindr
=====

A small JavaScript dependency injection framework.

```js
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

console.log(ford.service) // FakeService
```