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
    .map(content => this.update_track(content));
};

ContentController.update_track = (content) => {
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
      .then((saved) => saved[0] || data.id);
    }

    return app.models.track.create(content, {
      include: [
        {model: app.models.attachment, as: 'outline'},
        {model: app.models.attachment, as: 'preview'}
      ]
    }).then(track => track.id);
  }).then(id => {
    return app.models.track.findOne({
      where: {id},
      include: [{all: true, nested: true}]
    });
  });
};

ContentController.update_cars = () => {
  return app.helpers.content.cars()
    .map(content => this.update_car(content));
};

ContentController.update_car = (content) => {
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
      }).then((saved) => saved[0] || data.id);
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
    }).then(car => car.id);
  }).then(id => {
    return app.models.car.findOne({
      where: {id},
      include: [{all: true, nested: true}]
    });
  });
};