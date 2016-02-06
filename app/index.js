var express = require('express');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var config = require('config');
var bodyParser = require('body-parser');

// the app
var app = module.exports = express();
// var env = app.get('env');


// middleware
// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(require('compression')());
app.use('/assets', express.static(__dirname + '/assets/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(require('errorhandler')());
app.use(require('morgan')('dev'));

// env
app.set('config', config.get('app'));
app.set('views', path.join(__dirname, 'views'));
app.set('root', __dirname);
app.set('view engine', 'jade');
app.set('images', path.join(__dirname, 'assets/public/images'));
app.set('url', `${config.get('app.host')}:${config.get('app.port')}`);
app.set('url_images_root', `${app.get('url')}/assets/images`);

//
app.models = require('./models');
app.controllers = require('./controllers');
app.helpers = require('./helpers');