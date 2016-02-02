"use strict";

var readdirp = require('readdirp');
var path = require('path');
var promise = require('bluebird');
var _ = require('lodash');
var sh = require('shelljs');
var download = require('./download.js');
var uncompress = require('./uncompress.js');
var acserver_content_dir = '/home/acserver/acserver/content';
var dest_pwd = path.resolve(__dirname, '../../tmp');

module.exports = {
  clean (path) {
    return sh.rm('-rf', path);
  },
  clean_tmp () {
    return sh.rm('-rf', path.join(dest_pwd, 'extracted*'), path.join(dest_pwd, 'download*'));
  },
  move_to_acserver (content) {
    console.log("move_to_acserver (content) {");
    console.log(content);
    content.install_pwd = path.join(acserver_content_dir, content.content_type, content.root_name);
    console.log(`Moving: ${content.pwd} to ${content.install_pwd}`);
    sh.rm('-rf', content.install_pwd); // refactor when we add support for uploading skins
    sh.mv('-f', content.pwd, content.install_pwd);
    return content;
  },
  // find all of content json files in extracted directory,
  find_extracted_content (dir_path) {
    return new promise((resolve, reject) => {
      readdirp({
        root: dir_path,
        fileFilter: ['*ui_car.json', '*ui_track.json']
      }, (errors, data) => {
        if (errors) reject(errors);
        try {
          // console.log(data.files);
          var content_directories = _.reduce(data.files, (total, file) => {
            var content = this.resolve_content_root(file);
            if (_.isEmpty(content.pwd)) return total; // sometimes pwd will be ''
            if (!_.find(total, {pwd: content.pwd})) total.push(content);
            return total;
          }, []);
          resolve(content_directories);
        } catch (e) {
          console.log("REJECTION: find_extracted_content (dir_path) {");
          reject(e);
        }
      });
    });
  },
  // reduce readdirp output to an object of root content path and return the
  // install path
  resolve_content_root (readdirp_output) {
    var iterator = content_path(readdirp_output.fullParentDir.split(path.sep));
    var out = {
      content_type: (/(.*track.*)/gi.test(readdirp_output.name)) ? 'tracks' : 'cars'
    };

    out.pwd = _.reduce(_.range(2), (pwd, iteration) => {
      var out = iterator.next().value;
      if (out.dir_name == 'ui') pwd = out.pwd;
      return pwd;
    }, '');

    out.root_name = out.pwd.split(path.sep)[out.pwd.split(path.sep).length - 1];

    return out;
  }
};


function* content_path (path_ary) {
  // do a right loop on a path array.
  // used to determine what the root of the content is
  // essentially: /path/to/downloads/paulricard/ui/gp
  //              /path/to/downloads/paulricard/ui
  //              /path/to/downloads/paulricard // -> this is the root
  for (var i = path_ary.length - 1; i >= 0; i--) {
    yield {
      dir_name: path_ary[i],
      pwd: _.take(path_ary, i).join(path.sep)
    };
  }
}

function streamToPromise (stream) {
  return new promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('end', resolve);
  });
}
