var app = require('../../app.js');
var sys = require('systeminformation');
var EventEmitter = require('events');

module.exports = () => {

  var system_poll = new EventEmitter();

  // because we're setting a callback within a timer, we risk memory issues by
  // creating runaway callbacks
  // the idea here is to never fire more that +1 callback
  var interval_fired = callback_fired = 0;

  setInterval(() => {
    if ((interval_fired - callback_fired) <= 1){
      interval_fired += 1

      sys.getAllData((data) => {
        callback_fired += 1;
        if (callback_fired === 2) interval_fired = callback_fired = 0;

        system_poll.emit('data', data);
      });
    }
  }, 1500);

  system_poll.on('data', (info) => {
    app.io.emit('server_status', info);
  });
};
