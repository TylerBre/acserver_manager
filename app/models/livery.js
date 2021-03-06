var _ = require('lodash');
var path = require('path');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('livery', {
    livery_name: DataTypes.STRING,
    car_number: DataTypes.STRING,
    official: DataTypes.BOOLEAN,
    file_name: DataTypes.STRING,
    name: {
      type: DataTypes.VIRTUAL(DataTypes.STRING),
      get () {
        return _to_name(this);

        // this broke shit, so fuck it, you know?
        // return this.to_name(this);
      }
    }
  }, {
    classMethods: {
      associate (models) {
        this.belongsTo(models.attachment, {as: 'thumbnail'});
        this.belongsTo(models.attachment, {as: 'preview'});
        this.belongsTo(models.dlc);
      },
      to_name: (livery) => _to_name(livery),
      fromKunos (content) {
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
    }
  });
};

function _to_name (livery) {
  return (_.isEmpty(livery.livery_name)) ? livery.file_name : livery.livery_name;
}