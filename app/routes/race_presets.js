var promise = require('bluebird');
var app = require('../../app.js');
var router = require('express').Router();
var controllers = require('../controllers');
var helpers = require('../helpers');
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);
router.get('/new', (req, res, next) => {
  controllers.content.index().then((content) => {
    res.render('race_preset_new', content);
  })
});


module.exports = router;
