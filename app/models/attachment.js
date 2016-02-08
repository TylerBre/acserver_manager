var app = require('../../app');
var url_images_root = app.get('url_images_root');
var images = app.get('images');
var sh = require('shelljs');
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var promise = require('bluebird');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('attachment', {
    file_name: DataTypes.STRING,
    tmp: DataTypes.STRING,
    checksum: DataTypes.STRING(32),
    src_pwd: {
      type: DataTypes.VIRTUAL(DataTypes.STRING),
      get () {
        return path.join(images, 'attachments', `${this.id}`);
      }
    },
    src: {
      type: DataTypes.VIRTUAL(DataTypes.STRING),
      get () {
        return path.join(this.src_pwd, this.file_name);
      }
    },
    url: {
      type: DataTypes.VIRTUAL(DataTypes.STRING),
      get () {
        return to_url(this);
      }
    }
  }, {
    classMethods: { to_url },
    hooks: { beforeCreate, afterCreate, beforeUpdate }
  });
};

function to_url (attachment) {
  return `${url_images_root}/attachments/${attachment.id}/${attachment.file_name}`;
}

function beforeCreate (attachment) {
  return generate_checksum(attachment)
    .then((checksum) => {
      attachment.checksum = checksum;
      return attachment;
    })
    .catch(e => {
      console.error(e);
      attachment.checksum = null;
      return attachment;
    });
}

function afterCreate (attachment) {
  return move_file(attachment).then(() => attachment);
}

function beforeUpdate (attachment) {
  return generate_checksum(attachment)
    .then((checksum) => {
      if (checksum === attachment.checksum) return attachment;
      console.log("checksum not equal, re-saving file");
      attachment.checksum = checksum;
      return move_file(attachment).then(() => checksum);
    })
    .catch(e => {
      console.error(e);
      attachment.checksum = null;
      return attachment;
    });
}

function move_file (attachment) {
  return new promise((resolve, reject) => {
    sh.mkdir('-p', attachment.src_pwd);
    try {
      sh.cp('-f', attachment.tmp, attachment.src);
      resolve();
    } catch (e) { reject(e); }
  });
}

function generate_checksum (attachment) {
  return new promise((resolve, reject) => {
    var hash = crypto.createHash('md5');
    var stream = fs.createReadStream(attachment.tmp);

    stream.on('data', data => hash.update(data, 'utf8'));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}