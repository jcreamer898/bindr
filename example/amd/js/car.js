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