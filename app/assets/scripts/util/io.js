var config = require('config');
var io = require('socket.io-client');

module.exports = () => {
  var host = config.get('app.ipv4');
  var port = config.get('app.port');

  return io.connect(host, { port });
}
