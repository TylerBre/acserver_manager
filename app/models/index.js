var fs = require('fs');

fs
  .readdirSync(process.cwd())
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    exports[file.replace('.js', '')] = require('./' + file);
  });
