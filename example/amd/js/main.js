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