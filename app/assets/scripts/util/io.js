var io = require('socket.io-client')();
var config = require('./config');

module.exports = () => {
  return io.connect(config.host, { port: config.port })
}
