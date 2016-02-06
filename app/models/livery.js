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
        return (_.isEmpty(this.livery_name)) ? this.file_name : this.livery_name;
      }
    }
  }, {
    classMethods: {
      associate (models) {
        this.belongsTo(models.attachment, {as: 'thumbnail'});
        this.belongsTo(models.attachment, {as: 'preview'});
        this.belongsTo(models.dlc);
      },
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