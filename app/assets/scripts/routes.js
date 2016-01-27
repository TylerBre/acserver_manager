module.exports = (Vue) => {
  return {
    '/': {
      component: require('./components/dashboard.js')
    },
    '/content': {
      name: 'content_index',
      component: require('./components/content_index.js')
    },
    '/race_preset': {
      name: 'race_preset_index',
      component: require('./components/content_index.js')
    },
    '/race_preset/new': {
      name: 'race_preset_new',
      component: require('./components/race_preset_new.js')
    }
  }
}
