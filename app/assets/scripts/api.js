var Vue = require('vue');

module.exports ={
  race_preset: Vue.resource('/api/race_preset'),
  content: Vue.resource('/api/content')
}
