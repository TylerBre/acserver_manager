var Waterline = require('waterline');
var _ = require('lodash');
var path = require('path');

module.exports = Waterline.Collection.extend({
  identity: 'livery',
  connection: 'psql',

  attributes: {
    livery_name: 'string',
    car_number: 'string',
    official: 'boolean',
    file_name: 'string',
    thumbnail: {
      model: 'attachment'
    },
    preview: {
      model: 'attachment'
    },
    name () {
      return (_.isEmpty(this.livery_name)) ? this.file_name : this.livery_name;
    },
    toJSON () {
      var obj = this.toObject();
      obj.name = this.name();
      obj.car_id = this.for_car;
      return obj;
    },
    for_car: {
      model: 'car'
    }
  },

  fromKunos: (content) => {
    return {
      livery_name: content.data.skinname,
      car_number: content.data.number,
      official: content.official_content,
      file_name: content.directory_name,
      thumbnail: {
        file_name: content.thumbnail.split(path.sep)[content.thumbnail.split(path.sep).length - 1],
        tmp: content.thumbnail
      },
      preview: {
        file_name: content.preview.split(path.sep)[content.preview.split(path.sep).length - 1],
        tmp: content.preview
      }
    };
  }
});
