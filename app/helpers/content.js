var fs_content = require('./fs_content.js');
var path = require('path');
var _ = require('lodash');
var promise = require('bluebird');
var seed_content = path.resolve(__dirname, '../../seed/content');
var content_dir = path.resolve(__dirname, '../../lib/acserver/content');
var cars_dir = path.join(content_dir, 'cars');
var tracks_dir = path.join(content_dir, 'tracks');
var official_car_list = path.join(seed_content, 'official_car_list.json');
var official_car_liveries_list = path.join(seed_content, 'official_car_liveries_list.json');
var official_track_list = path.join(seed_content, 'official_track_list.json');

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

Content.livery = (car_directory_name, directory_name, pwd, ignore_seed_data) => {
  pwd = pwd || cars_dir;
  pwd = path.join(pwd, car_directory_name, 'skins');

  return fs_content.readFile(official_car_liveries_list)
    .then((official_car_liveries_list) => {
      var official_content = official_car_liveries_list[car_directory_name] && official_car_liveries_list[car_directory_name].indexOf(directory_name) >= 0;
      if (ignore_seed_data) official_content = false;
      return {
        pwd: (!official_content) ? pwd : path.join(seed_content, 'cars', car_directory_name, 'skins'),
        directory_name, car_directory_name, official_content
      };
    })
    .then((info) => {
      return promise.all([
        fs_content.readDirP(info.pwd, '*ivery.*'),
        fs_content.readDirP(info.pwd, '*review.*'),
        fs_content.readDirP(info.pwd, 'ui_skin.json')
      ]).spread((thumbnail, preview, json) => {
        info.thumbnail = (thumbnail.files[0]) ? thumbnail.files[0].fullPath : '';
        info.preview  = (preview.files[0]) ? preview.files[0].fullPath : '';
        info.data  = (json.files[0]) ? json.files[0].fullPath : '';
        return info;
      }).then((info) => {
        return fs_content.readFile(info.data).then((data) => {
          info.data = fs_content.un_format_json(data);
          return info;
        });
      });
    });
};

Content.tracks = (pwd, ignore_seed_data) => {
  pwd = pwd || tracks_dir;
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .then((directories) => this.track(directories, pwd, ignore_seed_data));
};

Content.liveries = (pwd, ignore_seed_data) => {
  pwd = pwd || cars_dir;


};

Content.track = (directory_names, pwd, ignore_seed_data) => {
  if (!_.isArray(directory_names)) directory_names = [directory_names];
  pwd = pwd || tracks_dir;

  return fs_content.readFile(official_track_list).then((official_track_list) => {
    return _.map(directory_names, (directory_name) => {
      var official_content = official_track_list.indexOf(directory_name) >= 0;
      if (ignore_seed_data) official_content = false;
      return {
        pwd: (!official_content) ? pwd : path.join(seed_content, 'tracks'),
        directory_name, official_content
      };
    });
  })
  .reduce(fs_content.ui_directories_only, [])
  .reduce(fs_content.ui_data_only((item, data, configuration) => {
    data = fs_content.un_format_json(data);
    var resource_path = path.join(item.file_obj.pwd, item.file_obj.directory_name, 'ui');
    return {
      'file_name': item.file_obj.directory_name,
      'official': item.file_obj.official_content,
      data, resource_path, configuration
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

