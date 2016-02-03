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

  var update_cars = this._update(app.helpers.content.cars, app.models.car, (car) => {
    return { file_name: car.file_name };
  });

  return promise.all([this.update_tracks(), update_cars]);
};

ContentController.update_tracks = () => {
  return app.helpers.content.tracks()
    .reduce((updated, content) => {
      content = app.models.track.fromKunos(content);
      return app.models.track.findOne({
          file_name: content.file_name,
          file_name_secondary: content.file_name_secondary
        })
        .populate('preview')
        .populate('outline')
        .then(data => {
          if (data) {
            // console.log(data.preview.tmp);
            // console.log(content.preview.tmp);
            return promise.all([
              app.models.track.update(data.id, _.omit(content, 'preview', 'outline')),
              app.models.attachment.update(data.preview.id, content.preview),
              app.models.attachment.update(data.outline.id, content.outline)
            ]).spread((data) => {
              updated.push(data);
              return updated;
            });
          }

          return app.models.track.create(content).then((data) => {
            updated.push(data);
            return updated;
          });
        });
    }, []);
};

ContentController._update = (content_scraper, model, find_criterea) => {
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
