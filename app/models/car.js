var path = require('path');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('car', {
    name: DataTypes.STRING,
    brand: DataTypes.STRING,
    description: DataTypes.TEXT,
    car_class: DataTypes.STRING,
    power: DataTypes.STRING,
    torque: DataTypes.STRING,
    weight: DataTypes.STRING,
    torque_curve: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
    power_curve: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
    official: DataTypes.BOOLEAN,
    file_name: DataTypes.STRING,
  }, {
    classMethods: {
      associate (models) {
        this.belongsTo(models.attachment, {as: 'logo'});
        this.hasMany(models.livery, {as: 'liveries'});
        this.belongsToMany(models.race_preset, {through: 'car_list'});
        this.belongsTo(models.dlc);
      },
      fromKunos (content) {
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
          logo: {
            file_name: content.logo.split(path.sep)[content.logo.split(path.sep).length - 1],
            tmp: content.logo
          }
        };
      }
    }
  });
};
