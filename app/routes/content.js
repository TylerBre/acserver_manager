var promise = require('bluebird');
var _ = require('lodash');
var app = require('../../app.js');
var router = require('express').Router();
var controllers = require('../controllers');
var helpers = require('../helpers');
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);
router.get('/', (req, res, next) => {
  controllers.content.index().then((content) => res.json(content));
});

router.get('/installing', (req, res, next) => {
  app.models.dlc.find({
    status: 'processing',
    socket_id: { '!': null }
  }).then((data) => res.json(data));
});

router.get('/tracks', (req, res, next) => {
  app.models.track.find().then((content) => res.json(content));
});

router.get('/tracks/raw', (req, res, next) => {
  helpers.content.tracks().then((content) => res.json(content));
});

router.get('/tracks/update', (req, res, next) => {
  controllers.content.update(helpers.content.tracks, app.models.track, (track) => {
    return {
      file_name: track.file_name,
      file_name_secondary: track.file_name_secondary
    };
  }).then((updated) => res.json(updated));
});

router.get('/tracks/destroy', (req, res, next) => {
  app.models.track.destroy().then(() => res.redirect('/content/tracks'));
});

router.get('/cars', (req, res, next) => {
  app.models.car.find().then((cars) => res.json(cars));
});

router.get('/cars/raw', (req, res, next) => {
  helpers.content.cars().then((content) => res.json(content));
});

router.get('/cars/update', (req, res, next) => {
  controllers.content.update(helpers.content.cars, app.models.car, (car) => {
    return {
      file_name: car.file_name
    };

  }).then((updated) => res.json(updated));
});

router.get('/cars/destroy', (req, res, next) => {
  app.models.car.destroy().then(() => res.redirect('/content/cars'));
});

module.exports = router;


// function deep_update (model, item, criterea, updated_count) {
//   // body...
// }
