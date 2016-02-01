// dlc in the literal sense: "Downloadable Content"
// it's assumed that all "dlc" will be unofficial, this is for content that
// users add, and is used to track the source of installed content, and
// the status of downloads/installations/errors

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'dlc',
  connection: 'psql',

  attributes: {
    socket_id: 'integer',
    url: 'string',
    install_log: 'array',
    status: {
      type: 'string',
      enum: ['errored', 'installed', 'processing'],
      defaultsTo: 'processing'
    },
    lifecycle: {
      type: 'string',
      enum: ['downloading', 'extracting', 'installing', 'registering', 'done'],
      defaultsTo: 'downloading'
    }
  }
});
