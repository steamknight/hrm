var ant = require('ant-plus');

var _io = null;

var exports = module.exports = {};

exports.start = function(io) {
    _io = io;

    // Initialize the antenna and the heart rate sensor
    var antenna = new ant.GarminStick3;
    var hrm = new ant.HeartRateSensor(antenna);

    if (!antenna.open()) {
        console.log('ERROR: ANT+ antenna not found!');
        _io.emit('hrm antenna', false);
        return;
    }

    // When we get heart rate data, emit it
    hrm.on('hbdata', function(data) {
        _io.emit('hrm beat', data.ComputedHeartRate);
    });

    // We care if the heart rate monitor somehow disconnects
    hrm.on('attached', function() {
        console.log('Heart Rate Monitor attached.');
        _io.emit('hrm attached', true);
    });

    hrm.on('detached', function() {
        console.log('Heart Rate Monitor detached.');
        _io.emit('hrm attached', false);
    });

    // Don't attached the heart rate monitor until we know the antenna is up
    antenna.on('startup', function(){
        console.log('Starting up ANT+ antenna...'); 
        console.log('Max channels:', antenna.maxChannels);
        _io.emit('hrm antenna', true);

        console.log('Attaching to heart rate monitor...');
        hrm.attach(0, 0); 
    });

    // Warn the page if the antenna goes down
    antenna.on('shutdown', function() {
        console.log('Shutting down ANT+ antenna...');
        _io.emit('hrm antenna', false);
    });
};