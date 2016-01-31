var download = require('./app/helpers/download.js');
var uncompress = require('./app/helpers/uncompress.js');
var path = require('path');
var promise = require('bluebird');
var dest_pwd = path.resolve('./tmp');

module.exports = {
  all (url) {
    var grab = download(url, dest_pwd);

    grab.on('output', (data) => console.log(`${data.progress} (${data.sizes})`));
    return streamToPromise(grab)
      .then((file_path) => {
        var open = uncompress('rar', file_path, dest_pwd);
        console.log('Extracting content, this will take a moment.');
        open.on('output', (data) => console.log(data));
        return streamToPromise(open);
      })
      .then(() => console.log('Finished!'))
      .catch((e) => console.log(e));
  },
  uncompress (file_path) {
    var open = uncompress('rar', file_path, dest_pwd);
    console.log(`Running: ${open.exec_cmd}`);
    console.log('This may take a moment for output');
    open.on('output', (data) => console.log(data));
    open.on('end', () => console.log('Finished! (no promises)'));
  },
  find_content (file_path) {
    file_path = path.resolve(dest_pwd, file_path); // for testing only
  }
};

function streamToPromise (stream) {
  return new promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('end', resolve);
  });
}
