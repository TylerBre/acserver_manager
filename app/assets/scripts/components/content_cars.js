var Vue = require('vue');

module.exports = Vue.extend({
  template: require('../templates/content_cars.html'),
  components: {
    car_list: require('./car_list.js')
  }
});

