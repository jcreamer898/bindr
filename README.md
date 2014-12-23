bindr
=====
Dependency injection is a software pattern that helps increase the testability of a given class by removing hard coded references to its dependencies.

In other words, take the following code...

```js
function Car() {
  this.engine = new Engine();
  this.dashboard = new Dashboard();
}
```

In the preceding code, `Car` is now dependent upon `Engine` and `Dashboard`. This makes it more difficult to unit test the `Car` in complete isolation. There's no way to create an
instance of a `Car` without in turn creating an instance of an `Engine` and a `Dashboard`.

Dependency injection allows for a small bit of configuration that says, 'When a class needs a dependency named x, create an instance of y'.

So, you can now have code that would look like...

```js
function Car(engine, dashboard) {
  this.engine = engine;
  this.dashboard = dashboard;
}

function Engine() {}
function Dashboard() {}

Car = bindr(Car, ['engine', 'dashboard']);

bindr.bind({
  "engine": Engine,
  "dashboard": Dashboard
});
```

Now `this.engine` will be assigned a new instance of `Engine`, and likewise for `Dashboard`.

`bindr` comes in and allows you to switch a dependencies constructor out. In production code, the `Car` might be dependent upon `Engine`, but when writing unit tests,
`bindr` allows you to swap that dependency out for a `FakeEngine`.

```js
var Car = require('Car');

function FakeEngine() {}
function FakeDashboard() {}

describe('when a car is created', function() {
    it('should be awesome', function() {
        var car = new Car(new FakeEngine(), new FakeDashboard());
    });
});
```

Now you are able to test your `Car` in complete isolation.

Another great advantage of Bindr is that it doesn't change your existing functions other than creating a small wrapper. You can simply plug them in your existing constructors, and use them as you normally would.

# API
There is a UMD wrapper around `bindr`, so you can either require it as an node, or AMD module, or it will expose `bindr` on the `window`.

### `bindr(fn, dependencies)`
Wraps a constructor for allowing dependency injection.

* `fn` {function}: the constructor you want to wrap
* `dep` {array}: list of the dependencies of this constructor

Returns a wrapped constructor

### `bindr.bind(options)`
Register dependencies with `bindr`.

* `options` {object}: an object containing dependencies

### `bindr.bind(name).to(Dependency)`
Register a `Dependency` to `name`.

* `name` {string}: The name of the dependency to create
* `dependency` {function}: The dependency to inject

### `bindr.reset()`
Clears all registered dependencies.

### `bindr.trace()`
Returns an object containing a trace of all dependencies

### `bindr.trace(name)`
Returns an object containing a trace of all dependencies for a given instance.

* `name` {object}: An instance of a function registered with `bindr()`


<!-- ### AMD
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
``` -->

This way you can easily swap out the `service` dependency of the `car`.

# Installation
Via NPM...

```bash
npm install bindr
```

Via Browser...

```html
    <script src="bindr.js"></script>
```

Via Bower...

```bash
bower install bindr --save
```

----------------------------------------------------

Any feedback would be appreciated!
