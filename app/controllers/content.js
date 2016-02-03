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

  return promise.all([this.update_tracks(), this.update_cars()]);
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

ContentController.update_cars = () => {
  return app.helpers.content.cars()
    .reduce((updated, content) => {
      content = app.models.car.fromKunos(content);
      return app.models.car.findOne({file_name: content.file_name})
        .populate('badge')
        .populate('logo')
        .then(data => {
          if (data) {
            return promise.all([
              app.models.car.update(data.id, _.omit(content, 'badge', 'logo')),
              app.models.attachment.update(data.badge.id, content.badge),
              app.models.attachment.update(data.logo.id, content.logo)
            ]).spread((data) => {
              updated.push(data);
              return updated;
            });
          }

          return app.models.car.create(content).then((data) => {
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
