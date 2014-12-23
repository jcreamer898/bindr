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
function Radio (stereo, cd) {
    this.stereo = stereo;
    this.cd = cd;
}

function Stereo() {}
function Cd() {}

Car = bindr(Car, ['engine', 'dashboard']);
Dashboard = bindr(Dashboard, ['ac', 'radio']);
Radio = bindr(Radio, ['stereo', 'cd']);

bindr.bind({
    "engine": Engine,
    "dashboard": Dashboard,
    "ac": Ac,
    "radio": Radio,
    "stereo": Stereo,
    "cd": Cd
});

var ford = new Car();

document.getElementById('car').innerHTML = JSON.stringify(ford, null, 4);
