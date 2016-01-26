var promise = require('bluebird');
var app = require('../../app.js');
var router = require('express').Router();
var controllers = require('../controllers');
var helpers = require('../helpers');
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);

router.get('/', (req, res, next) => {
  app.models.race_preset.find().then((content) => res.render('content_raw', content));
})

router.get('/new', (req, res, next) => {
  controllers.content.index().then((content) => {
    res.render('race_preset_new', content);
  })
});

router.post('/new', (req, res, next) => {
  app.models.race_preset.create(req.body).then(() => {
    res.redirect('/race_presets')
  })
})


module.exports = router;
