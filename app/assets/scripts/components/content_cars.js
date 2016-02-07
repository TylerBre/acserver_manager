var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return {
        content: this.$http.get('/api' + transition.to.path)
          .then(res => res.data)
      };
    }
  },
  data () {
    return {
      content: []
    };
  },
  computed: {
    grouped_cars () {
      return _.groupBy(this.content, 'brand');
    }
  },
  template: require('../templates/content_cars.html'),
  components: {
    card: require('./card.js'),
    dropdown: require('vue-strap').dropdown
  }
});

