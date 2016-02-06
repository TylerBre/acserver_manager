var _ = require('lodash');
var promise = require('bluebird');

var app = require('../../app');

var ContentController = module.exports;

ContentController.index = () => {
  return promise.all([
    app.models.car.findAll({include: [{all: true, nested: true}]}),
    app.models.track.findAll({include: [{all: true, nested: true}]})
  ]).spread((cars, tracks) => {
    return {cars, tracks};
  });
};

ContentController.update_all = () => {
  return promise.all([
    this.update_tracks().then(() => console.log('Updated tracks')),
    this.update_cars().then(() => console.log('Updated cars + liveries'))
  ]);
};

ContentController.update_tracks = () => {
  return app.helpers.content.tracks()
    .reduce((updated, content) => {
      content = app.models.track.fromKunos(content);
      return app.models.track.findOne({
        where: {
          file_name: content.file_name,
          file_name_secondary: content.file_name_secondary
        },
        include: [
          {model: app.models.attachment, as: 'outline'},
          {model: app.models.attachment, as: 'preview'}
        ]
      })
      .then(data => {
        if (data) {
          return app.models.track.update(content, {
            where: {id: data.id},
            include: [
              {model: app.models.attachment, as: 'outline'},
              {model: app.models.attachment, as: 'preview'}
            ]
          })
          .then((data) => {
            updated.push(data);
            return updated;
          });
        }

        return app.models.track.create(content, {
          include: [
            {model: app.models.attachment, as: 'outline'},
            {model: app.models.attachment, as: 'preview'}
          ]
        }).then((data) => {
          updated.push(data);
          return updated;
        });
      });
    }, []);
};

ContentController.update_cars = () => {
  return app.helpers.content.cars()
    .reduce((updated, content) => {

      var liveries = _.map(content.liveries, (livery) => app.models.livery.fromKunos(livery));
      content = app.models.car.fromKunos(content);
      content.liveries = liveries;

      return app.models.car.findOne({
        where: {file_name: content.file_name},
        include: [
          {model: app.models.attachment, as: 'logo'},
          {model: app.models.livery, as: 'liveries',
            include: [
              {model: app.models.attachment, as: 'thumbnail'},
              {model: app.models.attachment, as: 'preview'}
            ]
          }
        ]
      })
      .then(data => {
        if (data) {
          return app.models.car.update(content, {
            where: {id: data.id},
            include: [
              {model: app.models.attachment, as: 'logo'},
              {model: app.models.livery, as: 'liveries',
                include: [
                  {model: app.models.attachment, as: 'thumbnail'},
                  {model: app.models.attachment, as: 'preview'}
                ]
              }
            ]
          }).then(data => {
            updated.push(data);
            return updated;
          });
        }

        // console.log(content);
        return app.models.car.create(content, {
          include: [
            {model: app.models.attachment, as: 'logo'},
            {model: app.models.livery, as: 'liveries',
              include: [
                {model: app.models.attachment, as: 'thumbnail'},
                {model: app.models.attachment, as: 'preview'}
              ]
            }
          ]
        })
        .then(car => {
          updated.push(car);
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
          return model.update(content, data.id).then((data) => {
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
