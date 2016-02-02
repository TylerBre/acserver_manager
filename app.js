var express = require('express');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var config = require('config');
var bodyParser = require('body-parser');
var Waterline = require('waterline');

// the app
var app = module.exports = express();
var server = require('http').createServer(app);
var models = require('./app/models');
var env = app.get('env');

// waterline
var orm = new Waterline();
var ormConfig = _.extend(config.get('waterline'), {
  'adapters': {
    'psql': require('sails-postgresql')
  }
});

_.forOwn(models, (model) => orm.loadCollection(model));

// middleware
// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(require('compression')());
app.use('/assets', express.static(__dirname + '/app/assets/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(require('errorhandler')());
app.use(require('skipper')());
app.use(require('response-time')());

// env
app.set('config', config.get('app'));
app.set('views', path.join(__dirname, 'app/views'));
app.set('root', __dirname);
app.set('view engine', 'jade');

// routes
// app.use('/auth', require('./app/routes/auth'));
app.use('/api/race_preset', require('./app/routes/race_preset'));
app.use('/api/content', require('./app/routes/content'));
app.use('/', require('./app/routes/spa'));

// io routes
app.io = require('socket.io')(server);
require('./app/io/system_stats.js')();
require('./app/io/install_content.js')();

orm.initialize(ormConfig, (err, models) => {
  if (err) throw err;

  app.models = models.collections;
  app.connections = models.connections;
  app.controllers = require('./app/controllers');
  app.helpers = require('./app/helpers');

  app.controllers.content.update_all().then(() => {
    var success_text = '👉  ' + config.get('app.host') + ':' + config.get('app.port');
    server.listen(config.get('app.port'), () => console.log(success_text));
  });
});
