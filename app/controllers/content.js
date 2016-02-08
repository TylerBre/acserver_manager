var _ = require('lodash');
var promise = require('bluebird');

var app = require('../../app');

var ContentController = module.exports;
var all = true; var nested = true; var raw = true; var plain = true;

ContentController.index = () => {
  return promise.all([this.cars(), this.tracks()]).spread((cars, tracks) => {
    return {cars, tracks};
  });
};

ContentController.cars = () => {
  // this is heavily optimized for speed, but this should probably have a cache
  // layer rather than adding complexity to the app.
  // but by avoiding some joins, rendering the raw data, and manually
  // associating data, we save over 1s
  return promise.all([
    app.models.car.findAll({
      raw,
      include: [
        {model: app.models.attachment, as: 'logo'}
      ],
      attributes: { exclude: ['torque_curve', 'power_curve'] }
    }),
    app.models.livery.findAll({
      raw,
      include: [
        {model: app.models.attachment, as: 'thumbnail'},
        {model: app.models.attachment, as: 'preview'}
      ]
    })
  ]).spread((cars, liveries) => {
    liveries = _(liveries).map(livery => {
      livery.name = app.models.livery.to_name(livery);
      livery.thumbnail = {
        id: livery['thumbnail.id'],
        file_name: livery['thumbnail.file_name'],
        url: app.models.attachment.to_url({file_name: livery['thumbnail.file_name'], id: livery['thumbnail.id']})
      };
      livery.preview = {
        id: livery['preview.id'],
        file_name: livery['preview.file_name'],
        url: app.models.attachment.to_url({file_name: livery['preview.file_name'], id: livery['preview.id']})
      };
      return _.omit(livery, 'thumbnail.id', 'thumbnail.file_name', 'thumbnail.tmp', 'thumbnail.checksum', 'thumbnail.created_at', 'thumbnail.updated_at', 'preview.id', 'preview.file_name', 'preview.tmp', 'preview.checksum', 'preview.created_at', 'preview.updated_at');
    }).groupBy('car_id').value();


    cars = _(cars).map(car => {
      car.logo = {
        id: car['logo.id'],
        file_name: car['logo.file_name'],
        url: app.models.attachment.to_url({file_name: car['logo.file_name'], id: car['logo.id']})
      };
      return _.omit(car, 'logo.id', 'logo.file_name', 'logo.tmp', 'logo.checksum', 'logo.created_at', 'logo.updated_at');
    }).groupBy('brand').value();

    return _.reduce(Object.keys(cars).sort(), (total, key) => {
      total[key] = _.map(cars[key], car => {
        car.liveries = liveries[car.id] || [];
        return car;
      });
      return total;
    }, {});
  });
};

ContentController.tracks = () => {
  return app.models.track.findAll({include: [
    {model: app.models.attachment, as: 'outline'},
    {model: app.models.attachment, as: 'preview'}
  ]}).then(tracks => _.groupBy(tracks, 'file_name'));
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
  if (_.isEmpty(content.outline)) content.outline = content.map;
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
  if (_.isEmpty(content.logo)) content.logo = content.badge;
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