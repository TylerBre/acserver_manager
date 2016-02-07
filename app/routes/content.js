var promise = require('bluebird');
var app = require('../../app');
var router = require('express').Router();
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);
router.get('/', (req, res, next) => {
  app.controllers.content.index()
    .then(content => res.json(content));
});

router.get('/cars', (req, res, next) => {
  app.controllers.content.cars()
    .then(content => res.json(content));
});

router.get('/tracks', (req, res, next) => {
  app.controllers.content.tracks()
    .then(content => res.json(content));
});

router.get('/installing', (req, res, next) => {
  app.models.dlc.find({
    status: 'processing',
    socket_id: { '!': null }
  }).then(data => res.json(data));
});

module.exports = router;