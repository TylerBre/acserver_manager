var helpers = require('./index.js');
var fs_content = helpers.fs_content;
var path = require('path');
var fs = require('fs');
var fs_extra = require('fs-extra');
var promise = require('bluebird');
var sh = require('shelljs');

var content_dir = "/Volumes/ac_content";
var seed_content_dir = path.resolve('../../', 'seed', 'content');
var seed_cars_dir = path.join(seed_content_dir, 'cars');
var seed_tracks_dir = path.join(seed_content_dir, 'tracks');
var car_list_path = path.join(seed_content_dir, 'official_car_list.json');
var track_list_path = path.join(seed_content_dir, 'official_track_list.json');

var Seed = module.exports;


Seed.official_cars = () => {
  var official_car_list = JSON.parse(fs.readFileSync(car_list_path).toString());
  // Seed.clear_dir(seed_cars_dir);

  return helpers.content.cars(path.join(content_dir, 'cars'), true).reduce((total, car) => {
    if (official_car_list.indexOf(car.file_name) < 0) {
      console.log("Skipping: " + car.file_name);
      return total;
    }

    return Seed._create_car(car).then((data) => {
      total.push(data);
      return total;
    });
  }, []);
};

Seed.official_tracks = () => {
  var official_track_list = JSON.parse(fs.readFileSync(track_list_path).toString());
  Seed.clear_dir(seed_tracks_dir);

  return helpers.content.tracks(path.join(content_dir, 'tracks'), true).reduce((total, track) => {
    if (official_track_list.indexOf(track.file_name) < 0) {
      console.log("Skipping: " + track.file_name);
      return total;
    }

    total.push(Seed._create_track(track));
    return total;
  }, []);
};

Seed.clear_dir = (dir) => {
  fs_extra.removeSync(dir);
  fs.mkdirSync(dir);
};

Seed._create_car_list = () => {
  return fs_content.readDir(seed_cars_dir)
    .reduce(fs_content.directories_only(seed_cars_dir), [])
    .then((data) => {
      return fs_content.writeFile(car_list_path, JSON.stringify(data));
    }).then(() => {
      console.log("created: " + car_list_path);
      console.log("/*------------------------*/");
    });
};

Seed._create_track_list = () => {
  return fs_content.readDir(seed_tracks_dir)
    .reduce(fs_content.directories_only(seed_tracks_dir), [])
    .then((data) => {
      return fs_content.writeFile(track_list_path, JSON.stringify(data));
    }).then(() => {
      console.log("created: " + track_list_path);
      console.log("/*------------------------*/");
    });
};

// pull all cars in and then remove non-official cars to create an updated car list
Seed._move_cars = () => {
  // Seed.clear_dir(seed_cars_dir);
  return helpers.content.cars(path.join(content_dir, 'cars')).map(Seed._create_car);
};


Seed._move_tracks = () => {
  Seed.clear_dir(seed_tracks_dir);
  return helpers.content.tracks(path.join(content_dir, 'tracks'), true).map(Seed._create_track);
};


Seed._create_track = (track) => {
  var pwd = path.join(seed_tracks_dir, track.file_name, 'ui');
  if (track.configuration) pwd = path.join(pwd, track.configuration);

  var outline_path = path.join(pwd, 'outline.png');
  var preview_path = path.join(pwd, 'preview.png');
  var ui_track_path = path.join(pwd, 'ui_track.json');

  return promise.all([
      fs_content.copyFile(track.outline, outline_path),
      fs_content.copyFile(track.preview, preview_path),
      fs_content.writeJSON(ui_track_path, track.data)
    ])
    .then(() => {
      console.log("created: " + outline_path);
      console.log("created: " + preview_path);
      console.log("created: " + ui_track_path);
      console.log("/*------------------------*/");
      return track;
    })
    .catch({code: 'EEXIST'}, (e) => {
      console.log(e);
      return track;
    });
};

Seed._create_car = (car) => {
  console.log(car);
  var json_path = path.join(seed_cars_dir, car.file_name, 'ui', 'ui_car.json');
  var badge_path = path.join(seed_cars_dir, car.file_name, 'ui', 'badge.png');

  return fs_content.mkDir(path.join(seed_cars_dir, car.file_name))
    .then(() => {
      return fs_content.mkDir(path.join(seed_cars_dir, car.file_name, 'ui'));
    })
    .then(() => {
      return promise.all([
        fs_content.copyFile(car.badge, badge_path),
        fs_content.writeFile(json_path, JSON.stringify(car.data))
      ]).then(() => {
        console.log("created: " + json_path);
        console.log("created: " + badge_path);
        console.log("/*------------------------*/");
      });
    })
    .then(() => {
      return car;
    }).catch({code: 'EEXIST'}, (e) => {
      console.log(e);
      return car;
    });
};



/*----------  errors  ----------*/

function UnOfficialContentError (msg) {
  this.message = msg || "Unofficial content, skipping.";
  this.name = "UnOfficialContentError";
  Error.captureStackTrace(this, UnOfficialContentError);
}

UnOfficialContentError.prototype = Object.create(Error.prototype);
UnOfficialContentError.prototype.constructor = UnOfficialContentError;
