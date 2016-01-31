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
    }
  },
  template: require('../templates/content_raw.html')
});

