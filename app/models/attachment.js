var Waterline = require('waterline');
var app = require('../../app.js');
var sh = require('shelljs');
var path = require('path');

module.exports = Waterline.Collection.extend({
  identity: 'attachment',
  connection: 'psql',

  attributes: {
    file_name: 'string',
    tmp: 'string'
  },
  url: () => `${app.get('url_images_root')}/attachments/${this.id}/${this.file_name}`,
  afterCreate (attachment, next) {
    create(attachment);
    next();
  },
  afterUpdate (attachment, next) {
    create(attachment);
    next();
  },
  afterDestroy (attachment, next) {
    next();
  }
});

function create (attachment) {
  var dest = path.join(app.get('images'), `attachments/${attachment.id}`);
  sh.mkdir('-p', dest);
  // console.log(`Moving: ${attachment.tmp} to ${path.join(dest, attachment.file_name)}`);
  sh.cp('-f', attachment.tmp, path.join(dest, attachment.file_name));
}

function update (attachment) {
  console.log(`${attachment.id}: attachment update called`);
}
