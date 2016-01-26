var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data: function (transition) {
      return this.$http.get('/api/content').then(function (res) {
        // debugger;
        return res.data;
      });
    }
  },
  data: function () {
    return {
      track: null,
      car_list: [],
      cars: [],
      tracks: [],
      show_more_settings: false
    };
  },
  computed: {
    stringified_data: function () {
      return JSON.stringify(this.$data, null, 2)
    }
  },
  template: require('../../templates/race_preset_new.html')
});

