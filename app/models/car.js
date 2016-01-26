var Waterline = require('waterline');

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
    file_name: 'string'
  },

  fromKunos: (content) => {
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
    };
  }
});
