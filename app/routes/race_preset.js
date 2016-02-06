var promise = require('bluebird');
var app = require('../../app');
var router = require('express').Router();
var controllers = require('../controllers');
var helpers = require('../helpers');
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);

router.get('/', (req, res, next) => {
  app.models.race_preset.find()
    .populate('track')
    .then((data) => res.json(data));
});

router.post('/', (req, res, next) => {
  app.models.race_preset.create(req.body)
    .then((data) => res.json(data));
});


module.exports = router;
