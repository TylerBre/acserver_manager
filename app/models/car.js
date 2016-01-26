var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'car',
  connection: 'psql',

  attributes: {
    name: 'string',
    brand: 'string',
    description: 'text',
    carClass: 'string',
    power: 'string',
    torque: 'string',
    weight: 'string',
    torqueCurve: 'array',
    powerCurve: 'array',
    official: 'boolean',
    fileName: 'string'
  },

  fromKunos: (content) => {
    return {
      name: content.data.name,
      brand: content.data.brand,
      description: content.data.description,
      carClass: content.data.class,
      power: content.data.specs.bhp,
      torque: content.data.specs.torque,
      weight: content.data.specs.weight,
      torqueCurve: content.data.torqueCurve,
      powerCurve: content.data.powerCurve,
      official: content.official,
      fileName: content.fileName,
    };
  }
});
