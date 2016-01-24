var fs = require('fs');
var promise = require('bluebird');
var path = require('path');

var Content = module.exports;

Content.cars = function () {
  var car_path = '/home/ubuntu/acserver/content/cars';
  return readDir(car_path)
    .reduce((total, file_name) => {
      return is_directory(path.join(car_path, file_name)).then(() => {
        total.push(file_name);
        return total;
      }).catch((e) => {
        console.log(e);
        return total;
      });
    }, [])
    .reduce((total, file_name) => {
      return readDir(path.join(car_path, file_name)).then((data) => {
        if (data.indexOf('ui') > 0) total.push({file_name, data});
        return total;
      }).catch((e) => {
        console.log(e);
        return total;
      });
    }, [])
    .reduce((total, car_file) => {
      var ui_path = path.join(car_path, car_file.file_name, '/ui');
      return readDir(ui_path).then((data) => {
        return readFile(path.join(ui_path, 'ui_car.json')).then((data) => {
          total.push({
            'badge': path.join(car_path, car_file.file_name, 'badge.png'),
            'data': JSON.parse(un_format(data))
          });
          return total;
        });
      });
    }, [])
    .catch({code: 'ENOTDIR'}, () => {});
};

function readDir (path) {
  return new promise((resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

function readFile (path) {
  return new promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

function is_directory (path) {
  return new promise((resolve, reject) => {
    fs.stat(path, (err, data) => {
      if (err || !data.isDirectory()) reject(err || new Error("Not a directory."))

      resolve();
    });
  });
}

function un_format (data) {
  return data.replace(/\r\n|\r|\n|\t/g, '');
}
