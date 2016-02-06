var app = require('../../app.js');
var sh = require('shelljs');
var path = require('path');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('attachment', {
    file_name: DataTypes.STRING,
    tmp: DataTypes.STRING,
    url: {
      type: DataTypes.VIRTUAL(DataTypes.STRING),
      get: () => generate_url(this.get('id'), this.get('file_name'))
    }
  }, {
    hooks: {
      afterCreate: (attachment) => create(attachment),
      afterUpdate: (attachment) => create(attachment)
    }
  });
};

function generate_url (id, file_name) {
  return `${app.get('url_images_root')}/attachments/${id}/${file_name}`;
}

function create (attachment) {
  var dest = path.join(app.get('images'), `attachments/${attachment.id}`);
  sh.mkdir('-p', dest);
  // console.log(`Moving: ${attachment.tmp} to ${path.join(dest, attachment.file_name)}`);
  try {
    sh.cp('-f', attachment.tmp, path.join(dest, attachment.file_name));
  } catch (e) {
    // couldn't copy, squash console errors
    // this happened most likely because we couldn't find an attachment for a
    // content object. Make sure the seed data is up to date and has all of the
    // images needed for content
  }
}

function update (attachment) {
  console.log(`${attachment.id}: attachment update called`);
}
