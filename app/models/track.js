var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'track',
  connection: 'psql',

  attributes: {
    name: 'string',
    description: 'text',
    geotags: 'array',
    country: 'string',
    city: 'string',
    pitboxes: 'integer',
    direction: 'string',
    length: 'string'
  },

  fromKunos: (data) => {
    return {
      name: data.name,
      description: data.description,
      geotags: data.geotags,
      country: data.country,
      city: data.city,
      pitboxes: data.pitboxes,
      direction: data.run,
      length: data.length
    };
  }
});
