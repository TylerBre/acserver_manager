var promise = require('bluebird');
var _ = require('lodash');
var app = require('../../app.js');
var router = require('express').Router();
var controllers = require('../controllers');
var helpers = require('../helpers');
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);
router.get('/tracks/raw', (req, res, next) => {
  helpers.content.tracks().then((tracks) => res.render('content_cars', {cars: tracks}));
});

router.get('/cars', (req, res, next) => {
  app.models.car.find().then((cars) => res.render('content_cars', {cars}));
});

router.get('/cars/raw', (req, res, next) => {
  helpers.content.cars().then((cars) => res.render('content_cars', {cars}));
});

router.get('/cars/update', (req, res, next) => {
  var updated = 0;
  helpers.content.cars().map((_car) => {
    var car = app.models.car.fromKunos(_car.data);
    var criterea = {
      name: car.name,
      brand: car.brand
    };

    return app.models.car.findOrCreate(car).where(criterea).then((data) => {
      // we found a match, but the data is old, we need to update it
      if (!_.isMatch(data, car)) {
        updated += 1;
        return app.models.car.update(criterea, car);
      }

      // multiple matches in the db, delete them and add the new one
      if (_.isArray(data)) {
        updated += 1
        return app.models.car.destroy(data).then(() => {
          return app.models.car.create(car);
        });
      }

      // must be new data, or unchanged existing data
      return data;
    })
  }).then(() => res.send("updated: " + updated));
});

router.get('/cars/destroy', (req, res, next) => {

  app.models.car.destroy().then(() => {
    res.redirect('/content/cars');
  });
});

module.exports = router;


// function deep_update (model, item, criterea, updated_count) {
//   // body...
// }
