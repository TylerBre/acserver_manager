module.exports = (Vue) => {
  return {
    '/': {
      name: 'dashboard',
      component: require('./components/dashboard.js')
    },
    '/content': {
      component: {
        template: require('./templates/layouts/content.html')
      },
      subRoutes: {
        '/cars': {
          name: 'content_cars',
          component: require('./components/content_cars.js')
        },
        '/tracks': {
          name: 'content_tracks',
          component: require('./components/content_tracks.js')
        },
        '/new': {
          name: 'content_new',
          component: require('./components/content_new.js')
        }
      }
    },
    '/race_presets': {
      name: 'race_presets',
      component: {
        template: require('./templates/layouts/race_presets.html')
      },
      subRoutes: {
        '/': {
          name: 'race_preset_index',
          component: require('./components/race_preset_index.js')
        },
        '/new': {
          name: 'race_preset_new',
          component: require('./components/race_preset_new.js')
        }
      }
    }
  };
};
