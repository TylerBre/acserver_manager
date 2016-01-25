var fs_content = require('./fs_content.js');
var path = require('path');

var Content = module.exports;

Content.cars = (pwd) => {
  pwd = pwd || '/home/acserver/acserver/content/cars';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .reduce(fs_content.ui_directories_only(pwd), [])
    .reduce(fs_content.ui_data_only(pwd, 'ui_car.json', (item, data) => {
      return {
        'file_name': item.file_name,
        'badge': path.join(pwd, item.file_name, 'ui', 'badge.png'),
        'data': fs_content.un_format_json(data)
      };
    }), [])
    .catch({code: 'ENOTDIR'}, () => {});
};

Content.tracks = (pwd) => {
  pwd = pwd || '/home/acserver/acserver/content/tracks';
  return fs_content.readDir(pwd)
    .reduce(fs_content.directories_only(pwd), [])
    .reduce(fs_content.ui_directories_only(pwd), [])
    .reduce(fs_content.ui_data_only(pwd, 'ui_track.json', (item, data, configuration) => {
      return {
        'file_name': item.file_name,
        'configuration': configuration,
        // this might be the worst code I've ever written...
        'outline': path.join(path.join(pwd, item.file_name, 'ui'), ((configuration) ? path.join(configuration, 'outline.png') : 'outline.png')),
        'preview': path.join(path.join(pwd, item.file_name, 'ui'), ((configuration) ? path.join(configuration, 'preview.png') : 'preview.png')),
        'data': fs_content.un_format_json(data)
      };
    }), []);
};
