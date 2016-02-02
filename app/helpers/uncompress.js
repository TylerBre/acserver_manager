var path = require('path');
var sh = require('shelljs');
var cat_facts = require('cat-facts');
var EventEmitter = require('events');

const SUPPORTED_FORMATS = ['detect', 'rar'];

module.exports = (file_type, file_path, dest_pwd) => {
  if (SUPPORTED_FORMATS.indexOf(file_type) < 0) throw "Unsupported compression format";
  var extract = _extract(file_path, dest_pwd);
  if (file_type == 'detect') return extract.detect();
};

function _extract (file_path, dest_pwd) {
  if (!sh.which('7z')) throw "7zip is not installed, or is not in your PATH\nYou must install p7zip-full and p7zip-rar (multiverse) to extract downloads";
  return {
    detect () {
      var dir_name = `extracted_${Date.now()}`;
      var status = new EventEmitter();
      var extract_path = path.join(dest_pwd, dir_name);
      status.exec_cmd = `7z x -o${extract_path} ${file_path}`;
      sh.cd(dest_pwd);
      sh.mkdir(dir_name);
      var child = sh.exec(status.exec_cmd, {async: true});
      var seconds = 0;
      var cat_fact_interval = setInterval(() => {
        seconds += 10;
        status.emit('output', `\n💡 I know it's been ${seconds} seconds, but did you know that...\n${cat_facts.random()}?\n😺 😺 😺 😺 😺 😺 😺 😺 😺 😺 `);
      }, 10000);

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
