var http = require('http');
var fs = require('fs');
var path = require('path');

var out = '';
var NODE_ENV = process.env.NODE_ENV;
var env = (!NODE_ENV || NODE_ENV === '') ? 'development' : NODE_ENV;
var config_dir = path.resolve('./config');
var overlay_file = env + '.json';
var overlay_path = path.join(config_dir, overlay_file);
var overlay_exists = fs.readdirSync(config_dir).indexOf(overlay_file) >= 0;
var defaults = fs.readFileSync(path.join(config_dir, 'default.json'), 'utf8');
defaults = JSON.parse(defaults);

http.get({
  hostname: '169.254.169.254',
  port: 80,
  path: '/metadata/v1.json',
  agent: false
}, (res) => {
  res.on('data', (data) => {
      out += data.toString();
  });
  res.on('end', () => {
    out = JSON.parse(out);
    var ipv4 = out.interfaces.public[0].ipv4.ip_address;
    var overlay = {};
    if (overlay_exists) {
      overlay = fs.readFileSync(overlay_path, 'utf8');
      overlay = JSON.parse(overlay);
    }

    update_overlay(overlay, ipv4);
    process.exit();
  });
});

function update_overlay (overlay, ipv4) {
  overlay.app = overlay.app || {};
  overlay.app.ipv4 = ipv4;
  overlay.app.host = [
    overlay.app.protocol || defaults.app.protocol,
    overlay.app.ipv4 || defaults.app.ipv4
  ].join('');

  overlay._updated_from = 'bin/digitalocean_metadata.js';

  fs.writeFileSync(overlay_path, JSON.stringify(overlay, null, 2));
}
