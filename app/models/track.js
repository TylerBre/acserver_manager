var path = require('path');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('track', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    geotags: DataTypes.ARRAY(DataTypes.STRING),
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    pitboxes: DataTypes.INTEGER,
    direction: DataTypes.STRING,
    length: DataTypes.STRING,
    official: DataTypes.BOOLEAN,
    file_name: DataTypes.STRING,
    file_name_secondary: DataTypes.STRING,
  }, {
    classMethods: {
      associate (models) {
        this.belongsTo(models.attachment, {as: 'outline'});
        this.belongsTo(models.attachment, {as: 'preview'});
        this.belongsTo(models.dlc);
      },
      fromKunos (content) {
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
          outline: {
            file_name: content.outline.split(path.sep)[content.outline.split(path.sep).length - 1],
            tmp: content.outline
          },
          preview: {
            file_name: content.preview.split(path.sep)[content.preview.split(path.sep).length - 1],
            tmp: content.preview
          }
        };
      }
    }
  });
};
