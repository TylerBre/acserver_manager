var fs_content = require('./fs_content.js');
var path = require('path');
var _ = require('lodash');
var promise = require('bluebird');
var seed_content = path.resolve(__dirname, '../../seed/content');
var content_dir = path.resolve(__dirname, '../../lib/acserver/content');
var cars_dir = path.join(content_dir, 'cars');
var tracks_dir = path.join(content_dir, 'tracks');
var official_car_list = path.join(seed_content, 'official_car_list.json');

var Content = module.exports;

Content.cars = (pwd, ignore_seed_data) => {
  pwd = pwd || cars_dir;
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .then((directories) => this.car(directories, pwd, ignore_seed_data));
};

Content.car = (directory_names, pwd, ignore_seed_data) => {
  if (!_.isArray(directory_names)) directory_names = [directory_names];
  pwd = pwd || cars_dir;

  return fs_content.readFile(official_car_list).then((official_car_list) => {
    return _.map(directory_names, (directory_name) => {
      var official_content = official_car_list.indexOf(directory_name) >= 0;
      if (ignore_seed_data) official_content = false;
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
    var resource_path = path.join(item.file_obj.pwd, item.file_obj.directory_name);
    return {
      'file_name': item.file_obj.directory_name,
      'official': item.file_obj.official_content,
      data, resource_path
    };
  }), [])
  .map((car) => {
    // console.log(car)
    return promise.all([
      fs_content.readDirP(car.resource_path, '*badge.*'),
      fs_content.readDirP(car.resource_path, '*logo.*')
    ]).spread((badge, logo) => {
      car.badge = (badge.files[0]) ? badge.files[0].fullPath : '';
      car.logo  = (logo.files[0]) ? logo.files[0].fullPath : '';
      return car;
    });
  }).catch({code: 'ENOTDIR'}, () => {});
};

Content.tracks = (pwd, no_validate) => {
  pwd = pwd || tracks_dir;
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .then((directories) => this.track(directories, pwd, no_validate));
};

Content.track = (directory_names, pwd, no_validate) => {
  if (!_.isArray(directory_names)) directory_names = [directory_names];
  pwd = pwd || tracks_dir;
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
      configuration, resource_path,
      'file_name': item.file_obj.directory_name,
      'official': item.file_obj.official_content,
      'data': fs_content.un_format_json(data)
    };
  }), [])
  .map((track) => {
    var pwd = (track.configuration) ?  path.join(track.resource_path, track.configuration) : track.resource_path;
    return promise.all([
      fs_content.readDirP(pwd, '*outline.*'),
      fs_content.readDirP(pwd, '*preview.*'),
      fs_content.readDirP(track.resource_path, 'map.png')
    ]).spread((outline, preview, map) => {
      track.outline = (outline.files[0]) ? outline.files[0].fullPath : '';
      track.preview = (preview.files[0]) ? preview.files[0].fullPath : '';
      track.map     = (map.files[0]) ? map.files[0].fullPath : '';
      return track;
    });
  });
};

