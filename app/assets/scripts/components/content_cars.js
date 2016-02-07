var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return {
        content: this.$http.get('/api' + transition.to.path).then(res => res.data)
      };
    }
  },
  data () {
    return {
      content: []
    };
  },
  template: require('../templates/content_cars.html'),
  components: {
    car: require('./car.js')
  }
});

