var wget = require('wget-improved');
var path = require('path');
var promise = require('bluebird');
var convert_bytes = require('./convert_bytes.js');
var EventEmitter = require('events');

module.exports = (url, dest, timeout) => {
  dest = dest || path.resolve(__dirname, '../../tmp');
  dest = path.join(dest, ('download_' + Date.now()));
  timeout = timeout || 5000;

  var status = new EventEmitter();
  var dl = wget.download(url, dest);

  dl.on('error', (err) => status.emit('error', err));
  dl.on('end', () => status.emit('end', dest));
  dl.on('start', (file_size) => {
    total_size = convert_bytes(file_size, true, 2);
    dl.on('progress', (progress) => status.emit('output', {
      percent: progress * 100,
      progress: `${parseFloat(progress * 100).toFixed(1)}%`,
      sizes: `${convert_bytes(progress * file_size, true, 2)}/${total_size}`
    }));
  });

  return status;
};
