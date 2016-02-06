var read      = require('fs').readdirSync;
var join      = require('path').join;
var Sequelize = require('sequelize');
var config    = require('config');
var db_config  = config.get('db');
var orm_config = config.get('sequelize');

var sequelize = new Sequelize(db_config.database, db_config.username, db_config.password, {
  host: db_config.host,
  pool: db_config.pool,
  logging: orm_config.logging,
  dialect: orm_config.dialect,
  sync: orm_config.sync,
  define: {
    underscored: true
  }
});

var models = read(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') > 0) && (file !== 'index.js');
  })
  .reduce(function (result, file) {
    var model = sequelize.import(join(__dirname, file));
    result[model.name] = model;
    return result;
  }, {sequelize, Sequelize});

// create the associations
for (var name in models) {
  if ('associate' in models[name]) models[name].associate(models);
}

module.exports = models;