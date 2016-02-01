var path = require('path');
var promise = require('bluebird');

var app = require('../../app.js');
var download = require('../helpers/download.js');
var uncompress = require('../helpers/uncompress.js');
var install_content = require('../helpers/install_content.js');
var dest_pwd = path.resolve(__dirname, '../../tmp');

module.exports = () => {
  app.io.on('connection', (socket) => {
    socket.on('install:connect_socket', (id) => {
      var name = socket_name(id);
      console.log(`Connected to ${name}`);
      socket.join(name);
      app.io.to(name).emit('install:message', message(id, 'Connected successfully'));
    });

    socket.on('install:from_url', (msg) => {
      var name = socket_name(msg.id);

      app.models.dlc.create({url: msg.url}).then((dlc) => {
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
              return app.models.dlc.update(dlc.id, {lifecycle: 'extracting'})
                .then(() => file_path);
            })
            .then((file_path) => {
              var open = uncompress('rar', file_path, dest_pwd);
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
              return app.models.dlc.update(dlc.id, {lifecycle: 'installing'})
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
              return app.models.dlc.update(dlc.id, {lifecycle: 'registering'})
                .then(() => content);
            })
            .then(resolve).catch(reject);
        })
        // .then(() => {
        //   app.models.dlc.update(dlc.id, {install_log: logs, status: 'errored'}).then(() => {
        //     app.io.to(name).emit('install:done', message(msg.id, "Done!"));
        //   });
        // })
        .catch((e) => {
          logs.push(e.message);
          app.models.dlc.update(dlc.id, {install_log: logs, status: 'errored'}).then(() => generic(e));
        });
      });

      function generic (e) {
        console.log(e);
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

