var io = require('socket.io-client')();
var config = require('util/config');

module.exports = () => {
  return io.connect(config.host, { port: config.port })
}
