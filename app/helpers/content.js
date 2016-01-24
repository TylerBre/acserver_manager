var fs_content = require('./fs_content.js');
var path = require('path');

var Content = module.exports;

Content.cars = (pwd) => {
  pwd = pwd || '/home/ubuntu/acserver/content/cars';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .reduce(fs_content.ui_directories_only(pwd), [])
    .reduce(fs_content.ui_data_only(pwd, 'ui_car.json', (item, data) => {
      return {
        'badge': path.join(pwd, item.file_name, 'badge.png'),
        'data': fs_content.un_format_json(data)
      };
    }), [])
    .catch({code: 'ENOTDIR'}, () => {});
};

Content.tracks = (pwd) => {
  pwd = pwd || '/home/ubuntu/acserver/content/tracks';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .reduce(fs_content.ui_directories_only(pwd), [])
    .reduce(fs_content.ui_data_only(pwd, 'ui_track.json', (item, data) => {
      return {
        'outline': path.join(pwd, item.file_name, 'outline.png'),
        'preview': path.join(pwd, item.file_name, 'preview.png'),
        'data': fs_content.un_format_json(data)
      };
    }), [])
};
