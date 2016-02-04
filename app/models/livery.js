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
      return obj;
    },
    for_car: {
      model: 'car'
    }
  },

  fromKunos: (content) => {
    // return {
    //   name: content.data.name,
    //   brand: content.data.brand,
    //   description: content.data.description,
    //   car_class: content.data.class,
    //   power: content.data.specs.bhp,
    //   torque: content.data.specs.torque,
    //   weight: content.data.specs.weight,
    //   torque_curve: content.data.torqueCurve,
    //   power_curve: content.data.powerCurve,
    //   official: content.official,
    //   file_name: content.file_name,
    //   badge: {
    //     file_name: content.badge.split(path.sep)[content.badge.split(path.sep).length - 1],
    //     tmp: content.badge
    //   },
    //   logo: {
    //     file_name: content.logo.split(path.sep)[content.logo.split(path.sep).length - 1],
    //     tmp: content.logo
    //   }
    // };
  }
});
