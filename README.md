bindr
=====
Dependency injection is a software pattern that helps increase the testability of a given class by removing hard coded references to its dependencies.

In other words, take the following code...

```js
function Car(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;

    this.service = new Service();
}
```

In the preceding code, `Car` is now dependent upon `Service`. This makes it more difficult to unit test the `Car` in complete isolation. There's no way to create an
instance of a `Car` without in turn creating an instance of a `Service`.

Dependency injection allows for a small bit of configuration that says, 'When a class needs a dependency named x, create an instance of y'.

So, you can now have code that would look like...

```js
function Car(make, model, color, service) {
    this.make = make;
    this.model = model;
    this.color = color;
    this.service = service;

    bindr(this, arguments);
}

bindr.bind('service', Service);
```

You now accept your service as an argument in the constructor. 

`bindr` comes in and allows you to switch a dependencies constructor out. In production code, the `Car` might be dependent upon `Service`, but when writing unit tests,
`bindr` allows you to swap that dependency out for a `FakeService`.

```js
var Car = require('Car'),
    bindr = require('bindr');

function FakeService() {}

bindr.bind('service', FakeService);

describe('when a car is created', function() {
    it('should be awesome', function() {
        var car = new Car();

        expect(car.service instanceof FakeService).to.be.ok();
    });
});
```

In the unit tests, you simply bind service to `FakeService` instead of `Service` and the dependency will automatically get passed in.

### AMD
Another nice feature of `bindr` is its use in AMD projects with Require.js.

In a typical AMD module, you'd have code such as the following...

```js
// car.js
define(['service'], function(Service) {
    function Car() {
        this.make = make;
        this.model = model;
        this.color = color;
        this.service = new Service();
    }

    return Car;
});
```

You can see that when you require `car`, you automtically end up requiring `service` as well. `bindr` allows you to remove that dependency from the `car` module and swap 
out what service the car uses.

```js
// main.js
require.config({
    paths: {
        'bindr': '../../../dist/bindr'
    }
});

require(['bindr', 'car', 'service'], function(bindr, Car, Service) {
    bindr.bind('service', Service);

    var ford = new Car('Ford', 'Fusion', 'Maroon');

    document.getElementById('car').innerHTML = JSON.stringify(ford, null, 4);
});

// car.js
define(['bindr'], function (bindr) {
    function Car(make, model, color, service) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.service = service;
        
        bindr(this, arguments);
    }

    return Car;
});
```

This way you can easily swap out the `service` dependency of the `car`.

----------------------------------------------------

Any feedback would be appreciated!