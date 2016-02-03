var Waterline = require('waterline');
var _ = require('lodash');
var path = require('path');

module.exports = Waterline.Collection.extend({
  identity: 'car',
  connection: 'psql',

  attributes: {
    name: 'string',
    brand: 'string',
    description: 'text',
    car_class: 'string',
    power: 'string',
    torque: 'string',
    weight: 'string',
    torque_curve: 'array',
    power_curve: 'array',
    official: 'boolean',
    file_name: 'string',
    badge: {
      model: 'attachment'
    },
    logo: {
      model: 'attachment'
    }
  },

  fromKunos: (content) => {

    content.data.specs = content.data.specs || {};

    return {
      name: content.data.name,
      brand: content.data.brand,
      description: content.data.description,
      car_class: content.data.class,
      power: content.data.specs.bhp,
      torque: content.data.specs.torque,
      weight: content.data.specs.weight,
      torque_curve: content.data.torqueCurve,
      power_curve: content.data.powerCurve,
      official: content.official,
      file_name: content.file_name,
      badge: {
        file_name: content.badge.split(path.sep)[content.badge.split(path.sep).length - 1],
        tmp: content.badge
      },
      logo: {
        file_name: content.logo.split(path.sep)[content.logo.split(path.sep).length - 1],
        tmp: content.logo
      }
    };
  }
});
