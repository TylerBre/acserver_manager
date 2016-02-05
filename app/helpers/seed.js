var helpers = require('./index.js');
var fs_content = helpers.fs_content;
var path = require('path');
var fs = require('fs');
var fs_extra = require('fs-extra');
var promise = require('bluebird');
var sh = require('shelljs');
var _ = require('lodash');

var seed_content_dir = path.resolve(__dirname, '../../seed/content');
var seed_cars_dir = path.join(seed_content_dir, 'cars');
var seed_tracks_dir = path.join(seed_content_dir, 'tracks');
var car_list_path = path.join(seed_content_dir, 'official_car_list.json');
var car_liveries_list_path = path.join(seed_content_dir, 'official_car_liveries_list.json');
var track_list_path = path.join(seed_content_dir, 'official_track_list.json');

module.exports = Seed;

function Seed (content_dir) {
  content_dir = content_dir || "/Volumes/ac_content"; //-> just the name of a local share that I use

  this.official_cars = () => {
    var official_car_list = JSON.parse(fs.readFileSync(car_list_path).toString());
    // this.clear_dir(seed_cars_dir);

    return helpers.content.cars(path.join(content_dir, 'cars'), true).reduce((total, car) => {
      if (official_car_list.indexOf(car.file_name) < 0) {
        console.log("Skipping: " + car.file_name);
        return total;
      }

      return this._create_car(car).then((data) => {
        total.push(data);
        return total;
      });
    }, []);
  };

  this.official_tracks = () => {
    var official_track_list = JSON.parse(fs.readFileSync(track_list_path).toString());
    // this.clear_dir(seed_tracks_dir);

    return helpers.content.tracks(path.join(content_dir, 'tracks'), true).reduce((total, track) => {
      if (official_track_list.indexOf(track.file_name) < 0) {
        console.log("Skipping: " + track.file_name);
        return total;
      }

      total.push(this._create_track(track));
      return total;
    }, []);
  };

  this.official_liveries = () => {
    var official_car_liveries_list = JSON.parse(fs.readFileSync(car_liveries_list_path).toString());
    var official_car_list = JSON.parse(fs.readFileSync(car_list_path).toString());
    return helpers.content.cars(path.join(content_dir, 'cars'), true)
      .reduce((total, car) => {
        if (official_car_list.indexOf(car.file_name) < 0) {
          console.log("Skipping: " + car.file_name);
          return total;
        }

        var skins_dir = path.join(seed_cars_dir, car.file_name, 'skins');
        return new promise((resolve, reject) => {
          fs_extra.remove(skins_dir, (err) => {
            if (err) resolve();
            resolve();
          });
        }).then(() => {
          return fs_content.mkDir(skins_dir);
        })
        .then(() => {
          var m = _.map(official_car_liveries_list[car.file_name], (livery_name) => {
            return helpers.content.livery(car.file_name, livery_name, path.join(content_dir, 'cars'), true);
          });
          return promise.all(m);
        })
        .map((livery) => {
          return this._create_livery(car, livery);
        })
        .map((livery) => {
          total.push(livery);
          return livery;
        });
      }, []);
  };

  this.clear_dir = (dir) => {
    fs_extra.removeSync(dir);
    fs.mkdirSync(dir);
  };

  this.create_car_liveries_list = () => {
    var official_car_list = JSON.parse(fs.readFileSync(car_list_path).toString());
    return helpers.content.cars(path.join(content_dir, 'cars'), true)
      .reduce((total, car) => {
        var skin_path = path.join(car.resource_path, 'skins');
        return fs_content.readDir(skin_path)
          .reduce(fs_content.directories_only(skin_path), [])
          .then((skins) => {
            if (official_car_list.indexOf(car.file_name) >= 0) total[car.file_name] = skins;
            return total;
          });
      }, {})
      .then((data) => {
        return fs_content.writeFile(car_liveries_list_path, JSON.stringify(data, null, 2));
      })
      .then(() => {
        console.log("\ncreated: " + car_liveries_list_path);
        console.log("/*------------------------*/");
      });
  };

  this.create_car_list = () => {
    return fs_content.readDir(seed_cars_dir)
      .reduce(fs_content.directories_only(seed_cars_dir), [])
      .then((data) => {
        return fs_content.writeFile(car_list_path, JSON.stringify(data));
      }).then(() => {
        console.log("\ncreated: " + car_list_path);
        console.log("/*------------------------*/");
      });
  };

  this.create_track_list = () => {
    return fs_content.readDir(seed_tracks_dir)
      .reduce(fs_content.directories_only(seed_tracks_dir), [])
      .then((data) => {
        return fs_content.writeFile(track_list_path, JSON.stringify(data));
      }).then(() => {
        console.log("\ncreated: " + track_list_path);
        console.log("/*------------------------*/");
      });
  };

  this._create_track = (track) => {
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
        console.log("\ncreated: " + outline_path);
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

  this._create_car = (car) => {
    var json_path = path.join(seed_cars_dir, car.file_name, 'ui', 'ui_car.json');
    var badge_path = path.join(seed_cars_dir, car.file_name, 'ui', 'badge.png');

    this.clear_dir(path.join(seed_cars_dir, car.file_name));

    return fs_content.mkDir(path.join(seed_cars_dir, car.file_name, 'ui'))
      .then(() => {
        return promise.all([
          fs_content.copyFile(car.badge, badge_path),
          fs_content.writeFile(json_path, JSON.stringify(car.data))
        ]).then(() => {
          console.log("\ncreated: " + json_path);
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

  this._create_livery = (car, livery) => {
    var pwd = path.join(seed_cars_dir, car.file_name, 'skins', livery.directory_name);
    var json_path = path.join(pwd,'ui_skin.json');
    var thumbnail_path = path.join(pwd,'livery.png');
    var preview_path = path.join(pwd,'preview.png');

    return fs_content.mkDir(pwd).then(() => {
      return promise.all([
        fs_content.copyFile(livery.thumbnail, thumbnail_path).catch((e) => console.log(`${e.message}\nlivery.thumbnail: ${car.file_name}/skins/${livery.directory_name}`)),
        fs_content.copyFile(livery.preview, preview_path).catch((e) => console.log(`${e.message}\nlivery.preview: ${car.file_name}/skins/${livery.directory_name}`)),
        fs_content.writeFile(json_path, JSON.stringify(livery.data))
      ])
      .then(() => {
        // console.log("\ncreated: " + json_path);
        // console.log("created: " + thumbnail_path);
        // console.log("created: " + preview_path);
        // console.log("/*------------------------*/");
      })
      .then(() => livery)
      .catch({code: 'EEXIST'}, (e) => {
        console.log(e);
        return livery;
      });
    });
  };
}




/*----------  errors  ----------*/

function UnOfficialContentError (msg) {
  this.message = msg || "Unofficial content, skipping.";
  this.name = "UnOfficialContentError";
  Error.captureStackTrace(this, UnOfficialContentError);
}

UnOfficialContentError.prototype = Object.create(Error.prototype);
UnOfficialContentError.prototype.constructor = UnOfficialContentError;
