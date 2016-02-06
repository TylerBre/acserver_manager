var app = require('./app');
var server = require('http').createServer(app);
var config = require('config');

// routes
// app.use('/auth', require('./app/routes/auth'));
app.use('/api/race_preset', require('./app/routes/race_preset'));
app.use('/api/content', require('./app/routes/content'));
app.use('/', require('./app/routes/spa'));

// io routes
app.io = require('socket.io')(server);
require('./app/io/system_stats.js')();
require('./app/io/install_content.js')();

// initialize the db and start the server
app.models.sequelize.sync().then(() => {
  server.listen(config.get('app.port'), () => console.log(`👉  ${app.get('url')}`));
});
