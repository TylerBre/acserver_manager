var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return this.$http.get('/api' + transition.to.path).then((res) => res.data);
    }
  },
  data: () => {},
  computed: {
    stringified_data () {
      return JSON.stringify(this.$data, null, 2)
    }
  },
  template: require('../templates/content_raw.html')
});

