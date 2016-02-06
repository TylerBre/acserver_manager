var fs = require('fs');
var crypto = require('crypto');

module.exports = (src) => {
  src = src || '/home/acserver/acserver_manager/seed/content/cars/abarth500/skins/black_red/preview.png';
  var hash = crypto.createHash('md5');
  var stream = fs.createReadStream(src);

  stream.on('data', function (data) {
    hash.update(data, 'utf8');
  });

  stream.on('end', function () {
    var out = hash.digest('hex');
    console.log(out);
  });
};