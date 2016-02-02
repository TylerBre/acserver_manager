var fs_content = require('./fs_content.js');
var app = require('../../app');
var path = require('path');
var _ = require('lodash');
var promise = require('bluebird');
var seed_content = path.join(app.get('root'), 'seed/content');

var Content = module.exports;

Content.cars = (pwd) => {
  pwd = pwd || '/home/acserver/acserver/content/cars';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .then((directories) => this.car(directories, pwd));
};

Content.car = (directory_names, pwd) => {
  if (!_.isArray(directory_names)) directory_names = [directory_names];
  pwd = pwd || '/home/acserver/acserver/content/cars';

  return fs_content.readFile(path.join(seed_content, 'official_car_list.json')).then((official_car_list) => {
    return _.map(directory_names, (directory_name) => {
      var official_content = official_car_list.indexOf(directory_name) >= 0;
      return {
        pwd: (!official_content) ? pwd : path.join(seed_content, 'cars'),
        directory_name,
        official_content
      };
    });
  })
  .reduce(fs_content.ui_directories_only, [])
  .reduce(fs_content.ui_data_only((item, data, configuration) => {
    data = fs_content.un_format_json(data);
    return {
      'file_name': item.file_obj.directory_name,
      'official': item.file_obj.official_content,
      'data': data,
      'badge': path.join(item.file_obj.pwd, item.file_obj.directory_name, 'ui', 'badge.png')
    };
  }), []).catch({code: 'ENOTDIR'}, () => {});
};

Content.tracks = (pwd, no_validate) => {
  pwd = pwd || '/home/acserver/acserver/content/tracks';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .then((directories) => this.track(directories, pwd, no_validate));
};

Content.track = (directory_names, pwd, no_validate) => {
  if (!_.isArray(directory_names)) directory_names = [directory_names];
  pwd = pwd || '/home/acserver/acserver/content/tracks';
  return new promise((resolve, reject) => {
    if (no_validate) {
      _.map(directory_names, (directory_name) => {
        resolve({ pwd, directory_name });
      });
    }

    fs_content.readFile(path.join(seed_content, 'official_track_list.json'))
      .then((official_track_list) => {
        return _.map(directory_names, (directory_name) => {
          var official_content = official_track_list.indexOf(directory_name) >= 0;
          return {
            pwd: (!official_content) ? pwd : path.join(seed_content, 'tracks'),
            directory_name,
            official_content
          };
        });
      }).then(resolve).catch(reject);
  })
  .reduce(fs_content.ui_directories_only, [])
  .reduce(fs_content.ui_data_only((item, data, configuration) => {
    var resource_path = path.join(item.file_obj.pwd, item.file_obj.directory_name, 'ui');
    return {
      'file_name': item.file_obj.directory_name,
      'official': item.file_obj.official_content,
      'data': fs_content.un_format_json(data),
      'configuration': configuration,
      // this might be the worst code I've ever written...
      'outline': path.join(resource_path, ((configuration) ? path.join(configuration, 'outline.png') : 'outline.png')),
      'preview': path.join(resource_path, ((configuration) ? path.join(configuration, 'preview.png') : 'preview.png'))
    };
  }), []);
};
