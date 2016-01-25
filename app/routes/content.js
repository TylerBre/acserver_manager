var promise = require('bluebird');
var _ = require('lodash');
var app = require('../../app.js');
var router = require('express').Router();
var controllers = require('../controllers');
var helpers = require('../helpers');
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);
router.get('/tracks', (req, res, next) => {
  app.models.track.find().then((content) => res.render('content_raw', {content}));
});

router.get('/tracks/raw', (req, res, next) => {
  helpers.content.tracks().then((content) => res.render('content_raw', {content}));
});

router.get('/tracks/update', (req, res, next) => {
  controllers.content.update(helpers.content.tracks, app.models.track, (track) => {
    return {
      file_name: track.file_name,
      file_name_secondary: track.file_name_secondary
    }
  }).then((updated) => res.json(updated));
});

router.get('/tracks/destroy', (req, res, next) => {
  app.models.track.destroy().then(() => res.redirect('/content/tracks'));
});

router.get('/cars', (req, res, next) => {
  app.models.car.find().then((cars) => res.render('content_cars', {cars}));
});

router.get('/cars/raw', (req, res, next) => {
  helpers.content.cars().then((content) => res.render('content_raw', {content}));
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
