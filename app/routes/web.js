var promise = require('bluebird');
var app = require('../../app.js');
var router = require('express').Router();
var controllers = require('../controllers');
var helpers = require('../controllers');
// var requireAuthentication = controllers.auth.allow.registeredUsers;

// router.get('*', controllers.app.before);
router.get('/', function (req, res, next) {
  res.render('home', {
    content: "foo"
  });
});

module.exports = router;
