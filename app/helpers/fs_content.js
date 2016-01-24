var fs = require('fs');
var promise = require('bluebird');
var path = require('path');
var _ = require('lodash');
var JSON = require('json-parse-helpfulerror');

var FS = module.exports;

FS.readDir = (dir) => {
  return new promise((resolve, reject) => {
    fs.readdir(dir, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

FS.readFile = (dir) => {
  return new promise((resolve, reject) => {
    fs.readFile(dir, 'utf8', (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

FS.is_directory = (dir) => {
  return new promise((resolve, reject) => {
    fs.stat(dir, (err, data) => {
      if (err || !data.isDirectory()) reject(err || new Error("Not a directory."))

      resolve();
    });
  });
}

FS.directories_only = (pwd) => {
  return (total, file_name) => {
    return FS.is_directory(path.join(pwd, file_name)).then(() => {
      total.push(file_name);
      return total;
    }).catch((e) => {
      console.log(e);
      return total;
    });
  }
}

FS.ui_directories_only = (pwd) => {
  return (total, file_name) => {
    return FS.readDir(path.join(pwd, file_name)).then((data) => {
      if (data.indexOf('ui') > 0) total.push({file_name, data});
      return total;
    }).catch((e) => {
      console.log(e);
      return total;
    });
  }
}

FS.ui_data_only = (pwd, ui_filename, formatter) => {
  return (total, item) => {
    var ui_path = path.join(pwd, item.file_name, '/ui');
    return FS.readDir(ui_path).then((data) => {
      return FS.readFile(path.join(ui_path, ui_filename)).then((data) => {
        total.push(formatter(item, data));
        return total;
      });
    });
  }
}

FS.un_format_json = (data) => {
  // remove formatting characters
  data = data.replace(/\r\n|\r|\n|\t/g, '');

  // http://www.fileformat.info/info/unicode/char/feff/index.htm
  //
  // we were getting json with weird unicode formatting characters, solution is
  // to just convert the whole string to ASCII Characters.
  data = _.reduce(data, (reduced, character) => {
    reduced += character.charCodeAt(0) <= 127 ? character : '';
    return reduced;
  }, '');

  return JSON.parse(data);
}
