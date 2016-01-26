var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'attachment',
  connection: 'psql',

  attributes: {}
});
