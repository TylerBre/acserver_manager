var fs = require('fs');
var promise = require('bluebird');
var path = require('path');

var Content = module.exports;

Content.cars = () => {
  var pwd = '/home/ubuntu/acserver/content/cars';
  return readDir(pwd)
    .reduce(directories_only(pwd), [])
    .reduce(ui_directories_only(pwd), [])
    .reduce(ui_data_only(pwd, 'ui_car.json', (item, data) => {
      return {
        'badge': path.join(pwd, item.file_name, 'badge.png'),
        'data': JSON.parse(un_format(data))
      };
    }), [])
    .catch({code: 'ENOTDIR'}, () => {});
};

Content.tracks = () => {
  var pwd = '/home/ubuntu/acserver/content/tracks';
  return readDir(pwd)
    .reduce(directories_only(pwd), [])
    .reduce(ui_directories_only(pwd), [])
    .reduce(ui_data_only(pwd, 'ui_track.json', (item, data) => {
      return {
        'outline': path.join(pwd, item.file_name, 'outline.png'),
        'preview': path.join(pwd, item.file_name, 'preview.png'),
        'data': JSON.parse(un_format(data))
      };
    }), [])
};

function readDir (dir) {
  return new promise((resolve, reject) => {
    fs.readdir(dir, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

function readFile (dir) {
  return new promise((resolve, reject) => {
    fs.readFile(dir, 'utf8', (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

function is_directory (dir) {
  return new promise((resolve, reject) => {
    fs.stat(dir, (err, data) => {
      if (err || !data.isDirectory()) reject(err || new Error("Not a directory."))

      resolve();
    });
  });
}

function directories_only (pwd) {
  return (total, file_name) => {
    return is_directory(path.join(pwd, file_name)).then(() => {
      total.push(file_name);
      return total;
    }).catch((e) => {
      console.log(e);
      return total;
    });
  }
}

function ui_directories_only (pwd) {
  return (total, file_name) => {
    return readDir(path.join(pwd, file_name)).then((data) => {
      if (data.indexOf('ui') > 0) total.push({file_name, data});
      return total;
    }).catch((e) => {
      console.log(e);
      return total;
    });
  }
}

function ui_data_only (pwd, ui_filename, formatter) {
  return (total, item) => {
    var ui_path = path.join(pwd, item.file_name, '/ui');
    return readDir(ui_path).then((data) => {
      return readFile(path.join(ui_path, ui_filename)).then((data) => {
        total.push(formatter(item, data));
        return total;
      });
    });
  }
}

function un_format (data) {
  return data.replace(/\r\n|\r|\n|\t/g, '');
}
