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
    official: 'boolean'
  },

  fromKunos: (data) => {
    return {
      name: data.name,
      brand: data.brand,
      description: data.description,
      car_class: data.class,
      power: data.specs.bhp,
      torque: data.specs.torque,
      weight: data.specs.weight,
      torque_curve: data.torqueCurve,
      power_curve: data.powerCurve
    };
  }
});
