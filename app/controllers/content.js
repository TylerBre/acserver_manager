var _ = require('lodash');
var promise = require('bluebird');

var app = require('../../app.js');

var ContentController = module.exports;

ContentController.index = () => {
  return promise.all([
    app.models.car.find(),
    app.models.track.find()
  ]).spread((cars, tracks) => {
    return {cars, tracks};
  });
};

ContentController.update_all = () => {
  var update_tracks = this.update(app.helpers.content.tracks, app.models.track, (track) => {
    return {
      file_name: track.file_name,
      file_name_secondary: track.file_name_secondary
    };
  });

  var update_cars = this.update(app.helpers.content.cars, app.models.car, (car) => {
    return { file_name: car.file_name };
  });

  return promise.all([update_tracks, update_cars]);
};

ContentController.update_one = (content_scraper, model, find_criterea) => {

};

ContentController.update = (content_scraper, model, find_criterea) => {
  return content_scraper().reduce((updated, content) => {
    content = model.fromKunos(content);
    return model.findOne(find_criterea(content))
      .then(data => {
        if (data) {
          return model.update(data.id, content).then((data) => {
            updated.push(data);
            return updated;
          });
        }

        return model.create(content).then((data) => {
          updated.push(data);
          return updated;
        });
      });
  }, []).all();
};
