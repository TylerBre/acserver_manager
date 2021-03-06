var path = require('path');
var promise = require('bluebird');

var app = require('../../app');
var download = require('../helpers/download.js');
var uncompress = require('../helpers/uncompress.js');
var install_content = require('../helpers/install_content.js');
var dest_pwd = path.resolve(__dirname, '../../tmp');
var _ = require('lodash');

module.exports = () => {
  app.io.on('connection', (socket) => {
    socket.on('install:connect_socket', (id) => {
      app.models.dlc.findOne({socket_id: id, status: 'processing'}).then((dlc) => {
        var name = socket_name(id);
        socket.join(name);
        console.log(`Connected to ${name}`);
        app.io.to(name).emit('install:message', message(id, 'Connected successfully'));

        if (dlc) app.io.to(name).emit('install:continue', message(id, dlc));
      }).catch((e) => {
        console.error(e);
        var name = socket_name(id);
        socket.join(name);
        app.io.to(name).emit('install:message', message(id, e.message));
      });
    });

    socket.on('install:from_url', (msg) => {
      var name = socket_name(msg.id);

      app.models.dlc.create({url: msg.url, socket_id: msg.id}).then((dlc) => {
        var logs = [];
        return new promise((resolve, reject) => {
          var dl = download(msg.url, dest_pwd);

          dl.on('output', (data) => {
            logs.push(data.progress);
            app.io.to(name).emit('install:update:download', message(msg.id, data.progress));
          });
          dl.on('error', reject);

          streamToPromise(dl)
            .then((file_path) => { // lifecycle event
              return app.models.dlc.update({lifecycle: 'extracting'}, {where: {id: dlc.id}})
                .then(() => file_path);
            })
            .then((file_path) => {
              var open = uncompress('detect', file_path, dest_pwd);
              logs.push('Extracting content, this will take a moment.');
              app.io.to(name).emit('install:update:extraction', message(msg.id, logs[logs.length - 1]));
              open.on('output', (data) => {
                logs.push(data);
                app.io.to(name).emit('install:update:extraction', message(msg.id, data));
              });

              return streamToPromise(open).then((extraction_path) => {
                install_content.clean(file_path);
                logs.push(`Cleaned up: ${file_path}`);
                app.io.to(name).emit('install:update:extraction', message(msg.id, logs[logs.length - 1]));
                return extraction_path;
              });
            })
            .then((extraction_path) => { // lifecycle event
              return app.models.dlc.update({lifecycle: 'installing'}, {where: {id: dlc.id}})
                .then(() => extraction_path);
            })
            .then((extraction_path) => {
              logs.push(`Extracted successfully to: ${extraction_path}`);
              app.io.to(name).emit('install:update:extraction', message(msg.id, logs[logs.length - 1]));
              return install_content.find_extracted_content(extraction_path)
                .map((content) => install_content.move_to_acserver(content))
                .then((content) => {
                  install_content.clean(extraction_path);
                  logs.push(`Cleaned up: ${extraction_path}`);
                  app.io.to(name).emit('install:update:extraction', message(msg.id, logs[logs.length - 1]));
                  return content;
                });
            })
            .map((content) => {
              logs.push(`Installed: ${content.install_pwd}`);
              app.io.to(name).emit('install:update:extraction', message(msg.id, logs[logs.length - 1]));
              return content;
            })
            .then((content) => { // lifecycle event
              return app.models.dlc.update({lifecycle: 'registering'}, {where: {id: dlc.id}})
                .then(() => content);
            })
            .map((content) => {
              var model = (content.content_type == 'cars') ? 'car' : 'track';
              var method = (content.content_type == 'cars') ? 'update_car' : 'update_track';
              var pwd = content.pwd;

              return app.helpers.content[model](content.root_name).then(data => {
                return promise.all(_.map(data, _content => {
                  return app.controllers.content[method](_content).then(_content => {
                    return _content.setDlc(dlc);
                  });
                }));
              }).then(() => pwd);
            })
            .map((content) => {
              logs.push(`Registered: ${content}`);
              app.io.to(name).emit('install:update:registration', message(msg.id, logs[logs.length - 1]));
              return content;
            })
            .then(() => { // lifecycle event
              logs.push(`Done!`);
              return app.models.dlc.update({lifecycle: 'done', status: 'installed'}, {where: {id: dlc.id}});
            })
            .then(resolve).catch(reject);
        })
        .then(() => { // lifecycle event
          app.models.dlc.update({install_log: logs}, {where: {id: dlc.id}}).then(() => {
            app.io.to(name).emit('install:done', message(msg.id, logs[logs.length - 1]));
          });
        })
        .catch((e) => {
          logs.push(e.message);
          generic(e);
          app.models.dlc.update({install_log: logs, status: 'errored'}, {where: {id: dlc.id}}).then(() => generic(e));
        });
      });

      function generic (e) {
        console.error(e);
        app.io.to(name).emit('install:update:error', message(msg.id, e.message));
      }
    });
  });
};

function socket_name (id) {
  return `install-${id}`;
}

function message (id, msg, err) {
  // console.log(msg);
  return {
    id, msg, err,
    time: Date.now()
  };
}

function streamToPromise (stream) {
  return new promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('end', resolve);
  });
}

