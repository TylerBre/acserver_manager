var _ = require('lodash');
var promise = require('bluebird');
var app = require('../../app');

var RacePresetsController = module.exports;

RacePresetsController.index = () => {
  return app.models.race_preset
    .findAll({include: [{all: true, nested: true}]});
};

RacePresetsController.create = (data) => {
  console.log(_.map(data.cars, car => car.id));
  return promise
    .all([
      app.models.track.findOne({where: {id: data.track}}),
      app.models.car.findAll({where: {id: _.map(data.cars, car => car.id)}}),
      app.models.race_preset.create(data)
    ])
    .spread((track, cars, race_preset) => {
      console.log(_.map(cars, car => car.id));
      return promise
        .all([
          race_preset.setTrack(track),
          race_preset.setCars(cars)
        ])
        .then(() => race_preset.id);
    })
    .then(id => {
      return app.models.race_preset.findOne({
        where: {id},
        include: [{all: true, nested: true}]
      });
    });
};