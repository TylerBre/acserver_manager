var express = require('express');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var config = require('config');
var bodyParser = require('body-parser');

// the app
var app = module.exports = express();
var env = app.get('env');

// middleware
// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(require('compression')());
app.use(require('response-time')());
app.use('/assets', express.static(__dirname + '/app/assets/compiled'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(require('errorhandler')());

// env
app.set('config', config.get('app'))
app.set('views', path.join(__dirname, 'app/views'));
app.set('root', __dirname);
app.set('view engine', 'jade');

// routes
// app.use('/auth', require('./app/routes/auth'));
app.use('/race', require('./app/routes/race'));
app.use('/content', require('./app/routes/content'));
app.use('/', require('./app/routes/web'));


app.listen(config.get('app.port'), function () {
  console.log('Listening on port ' + config.get('app.port'));
});
