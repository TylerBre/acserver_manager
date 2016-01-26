var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data: function (transition) {
      return this.$http.get('/api' + transition.to.path).then(function (res) {
        return res.data;
      });
    }
  },
  data: function () {
    return {};
  },
  computed: {
    stringified_data: function () {
      return JSON.stringify(this.$data, null, 2)
    }
  },
  template: require('../templates/content_raw.html')
});

