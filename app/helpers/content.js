var fs_content = require('./fs_content.js');
var path = require('path');

var Content = module.exports;

Content.cars = () => {
  var pwd = '/home/ubuntu/acserver/content/cars';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .reduce(fs_content.ui_directories_only(pwd), [])
    .reduce(fs_content.ui_data_only(pwd, 'ui_car.json', (item, data) => {
      return {
        'badge': path.join(pwd, item.file_name, 'badge.png'),
        'data': JSON.parse(fs_content.un_format(data))
      };
    }), [])
    .catch({code: 'ENOTDIR'}, () => {});
};

Content.tracks = () => {
  var pwd = '/home/ubuntu/acserver/content/tracks';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .reduce(fs_content.ui_directories_only(pwd), [])
    .reduce(fs_content.ui_data_only(pwd, 'ui_track.json', (item, data) => {
      return {
        'outline': path.join(pwd, item.file_name, 'outline.png'),
        'preview': path.join(pwd, item.file_name, 'preview.png'),
        'data': JSON.parse(fs_content.un_format(data))
      };
    }), [])
};
