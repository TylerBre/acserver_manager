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
  from_url (url) {
    var dl = download(url, dest_pwd);
    dl.on('output', (data) => console.log(`${data.progress} (${data.sizes})`));

    return streamToPromise(dl)
      .then((file_path) => {
        var open = uncompress('rar', file_path, dest_pwd);
        console.log('Extracting content, this will take a moment.');
        open.on('output', (data) => console.log(data));
        return streamToPromise(open);
      })
      .then((extraction_path) => this.find_extracted_content(extraction_path))
      .map((content) => this.move_to_acserver(content))
      .map((content) => console.log(`Installed: ${content.install_pwd}`))
      .then(() => this.clean_tmp())
      .catch(console.log);
  },
  clean (path) {
    return sh.rm('-rf', path);
  },
  clean_tmp () {
    return sh.rm('-rf', path.join(dest_pwd, 'extracted*'), path.join(dest_pwd, 'download*'));
  },
  move_to_acserver (content) {
    var pwd_ary = content.pwd.split(path.sep);
    content.install_pwd = path.join(acserver_content_dir, content.content_type, pwd_ary[pwd_ary.length - 1]);
    console.log(`Moving: ${content.pwd} to ${content.install_pwd}`);
    sh.rm('-rf', content.install_pwd);
    sh.mv('-f', content.pwd, content.install_pwd);
    content.install_pwd = content.install_pwd;
    return content;
  },
  // find all of content json files in extracted directory,
  find_extracted_content (dir_path) {
    return new promise((resolve, reject) => {
      readdirp({
        root: dir_path,
        fileFilter: 'ui_*.json'
      }, (errors, data) => {
        if (errors) reject(errors);
        try {
          var content_directories = _.reduce(data.files, (total, file) => {
            var content = this.resolve_content_root(file);
            if (!_.find(total, {pwd: content.pwd})) total.push(content);
            return total;
          }, []);
          resolve(content_directories);
        } catch (e) {
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
      content_type: (readdirp_output.name == 'ui_track.json') ? 'tracks' : 'cars'
    };

    out.pwd = _.reduce(_.range(2), (pwd, iteration) => {
      var out = iterator.next().value;
      if (out.dir_name == 'ui') pwd = out.pwd;
      return pwd;
    }, '');

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
