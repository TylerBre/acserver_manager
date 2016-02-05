var fs = require('fs');
var fs_extra = require('fs-extra');
var promise = require('bluebird');
var readdirp = require('readdirp');
var path = require('path');
var _ = require('lodash');
// var JSON = require('json-parse-helpfulerror');

var FS = module.exports;

FS.readDir = (dir) => {
  return new promise((resolve, reject) => {
    fs.readdir(dir, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
};

FS.readDirP = (root, fileFilter) => {
  return new promise((resolve, reject) => {
    readdirp({root, fileFilter}, (errors, data) => {
      if (errors) reject(errors);
      resolve(data);
    });
  });
};

FS.readFile = (dir) => {
  return new promise((resolve, reject) => {
    fs.readFile(dir, 'utf8', (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
};

FS.writeFile = (file_path, data) => {
  return new promise((resolve, reject) => {
    fs.writeFile(file_path, data, (err) => {
      if (err) reject(err);

      resolve();
    });
  });
};

FS.writeJSON = (file_path, data) => {
  return new promise((resolve, reject) => {
    fs_extra.outputJson(file_path, data, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
};

FS.copyFile = (src, dest) => {
  return new promise((resolve, reject) => {
    fs_extra.copy(src, dest, (err) => {
      if (err) reject(err);

      resolve();
    });
  });
};

FS.mkDir = (dir) => {
  return new promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err) reject(err);

      resolve();
    });
  });
};


FS.is_directory = (dir) => {
  return new promise((resolve, reject) => {
    fs.stat(dir, (err, data) => {
      if (err) reject(err);
      if (!data.isDirectory()) reject(`Not a directory, skipping:\n${dir}`);
      if (data.isDirectory()) resolve();
    });
  });
};

FS.exists = (dir) => {
  return new promise((resolve, reject) => {
    fs.exists(dir, (exists) => exists ? resolve() : reject());
  });
};

FS.directories_only = (pwd) => {
  return (total, file_name) => {
    return FS.is_directory(path.join(pwd, file_name)).then(() => {
      total.push(file_name);
      return total;
    }).catch((e) => {
      console.log(e);
      return total;
    });
  };
};

FS.ui_directories_only = (total, file_obj) => {
  return FS.readDir(path.join(file_obj.pwd, file_obj.directory_name)).then((data) => {
    if (data.indexOf('ui') >= 0) total.push({file_obj, data});
    return total;
  }).catch((e) => {
    console.log(e);
    return total;
  });
};

FS.ui_data_only = (formatter) => {
  return (total, item) => {

    var ui_path = path.join(item.file_obj.pwd, item.file_obj.directory_name, 'ui');
    return FS.readDir(ui_path).then((data) => {
      var ui_filename = get_ui_filename(data);
      if (ui_filename) {
        return FS.readFile(path.join(ui_path, ui_filename)).then((data) => {
          total.push(formatter(item, data, null));
          return total;
        });
      }

      return promise.reduce(data, (_total, file_name) => {
        var configuration_path = path.join(ui_path, file_name);
        return FS.is_directory(configuration_path).then(() => {
          return FS.readDir(configuration_path).then((data) => {
            var out = {};
            out.file_name = file_name;
            out.configuration_path = configuration_path;
            out.ui_filename = get_ui_filename(data);
            _total.push(out);
            return _total;
          });
        }).catch(() => {
          // console.log(data);
          return _total;
        });
      }, []).reduce((_total, data) => {
        if (!data.ui_filename) throw "No ui json file. Cannot save data";
        return FS.readFile(path.join(data.configuration_path, data.ui_filename)).then((_data) => {
          _total.push(formatter(item, _data, data.file_name));
          return _total;
        });
      }, total);
    });
  };

  function get_ui_filename (file_list) {
    var file_index = _.findIndex(file_list, file => /(.*ui_.*.json)/gi.test(file));
    var ui_filename = null;
    if (file_index >= 0) ui_filename = file_list[file_index];
    return ui_filename;
  }
};

FS.un_format_json = (data) => {

    // remove formatting characters
    data = data.replace(/\r\n|\r|\n|\t|\0/g, '');

    // http://www.fileformat.info/info/unicode/char/feff/index.htm

    // we were getting json with weird unicode formatting characters, solution is
    // to just convert the whole string to ASCII Characters.
    data = _.reduce(data, (reduced, character) => {
      reduced += character.charCodeAt(0) <= 127 ? character : '';
      return reduced;
    }, '');


  return JSON.parse(data);
};
