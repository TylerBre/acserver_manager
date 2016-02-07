var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return {
        content: this.$http.get('/api' + transition.to.path).then((res) => res.data)
      };
    }
  },
  data () {
    return {
      content: {}
    };
  },
  computed: {
    stringified_data () {
      return JSON.stringify(this.content, null, 2);
    },
    grouped_cars () {
      return _.groupBy(this.content.cars, 'brand');
    }
  },
  template: require('../templates/content_index.html'),
  components: {
    card: require('./card.js'),
    dropdown: require('vue-strap').dropdown
  }
});

