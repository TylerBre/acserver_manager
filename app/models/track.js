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
    length: 'string',
    official: 'boolean',
    file_name: 'string',
    file_name_secondary: 'string'
  },

  fromKunos: (content) => {
    return {
      name: content.data.name,
      description: content.data.description,
      geotags: content.data.geotags,
      country: content.data.country,
      city: content.data.city,
      pitboxes: parseInt(content.data.pitboxes),
      direction: content.data.run,
      length: content.data.length,
      official: content.official,
      file_name: content.file_name,
      file_name_secondary: content.configuration,
    };
  }
});
