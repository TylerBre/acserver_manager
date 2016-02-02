var path = require('path');
var sh = require('shelljs');
var cat_facts = require('cat-facts');
var EventEmitter = require('events');

const SUPPORTED_FORMATS = ['rar'];

module.exports = (file_type, file_path, dest_pwd) => {
  if (SUPPORTED_FORMATS.indexOf(file_type) < 0) throw "Unsupported compression format";
  var extract = _extract(file_path, dest_pwd);
  if (file_type == 'rar') return extract.rar();
};

function _extract (file_path, dest_pwd) {
  return {
    rar () {
      if (!sh.which('unrar')) throw "unrar is not installed, or is not in your PATH";
      var dir_name = `extracted_${Date.now()}`;
      var status = new EventEmitter();
      var extract_path = path.join(dest_pwd, dir_name);
      status.exec_cmd = `unrar ${file_path} ${extract_path}`;
      sh.cd(dest_pwd);
      sh.mkdir(dir_name);
      var child = sh.exec(status.exec_cmd, {async: true});
      var seconds = 0;
      var cat_fact_interval = setInterval(() => {
        seconds += 5;
        status.emit('output', `\n💡 I know it's been ${seconds} seconds, but did you know that...\n${cat_facts.random()}?\n😺 😺 😺 😺 😺 😺 😺 😺 😺 😺 `);
      }, 5000);

      child.stdout.on('data', data => status.emit('output', data));
      child.stderr.on('data', err => {
        console.log('Error!');
        status.emit('error', new Error(err));
      });
      child.on('close', () => {
        clearInterval(cat_fact_interval);
        status.emit('end', extract_path);
      });
      return status;
    }
  };
}
