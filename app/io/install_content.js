var app = require('../../app.js');
var download = require('../helpers/download.js');
var uncompress = require('../helpers/uncompress.js');
var path = require('path');
var dest_pwd = path.resolve(__dirname, '../../tmp');

module.exports = () => {
  app.io.on('connection', (socket) => {
    socket.on('install:connect_socket', (id) => {
      var name = socket_name(id);
      console.log(`Connected to ${name}`);
      socket.join(name);
      app.io.to(name).emit('install:message', message(id, 'Connected successfully'));
    });

    socket.on('install:from_url', (msg) => {
      console.log(msg);
      var name = socket_name(msg.id);
      var dl = download(msg.url, dest_pwd);
      dl.on('output', (data) => {
        app.io.to(name).emit('install:update', message(msg.id, data.progress));
      });
    });
  });
};

function socket_name (id) {
  return `install-${id}`;
}

function message (id, msg, err) {
  return {
    id, msg, err,
    time: Date.now()
  };
}
