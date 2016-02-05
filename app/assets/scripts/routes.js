module.exports = (Vue) => {
  return {
    '/': {
      component: require('./components/dashboard.js')
    },
    '/content': {
      component: {
        template: require('./templates/layouts/content.html')
      },
      subRoutes: {
        '/': {
          name: 'content_index',
          component: require('./components/content_index.js')
        },
        '/new': {
          name: 'content_new',
          component: require('./components/content_new.js')
        }
      }
    },
    '/race_preset': {
      name: 'race_preset_index',
      component: require('./components/content_index.js')
    },
    '/race_preset/new': {
      name: 'race_preset_new',
      component: require('./components/race_preset_new.js')
    }
  };
};
