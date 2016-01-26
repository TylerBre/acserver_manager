var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return this.$http.get('/api/content').then((res) => res.data);
    }
  },
  data () {
    return {
      track: null,
      car_list: [],
      cars: [],
      tracks: [],
      show_more_settings: false
    };
  },
  computed: {
    stringified_data () {
      return JSON.stringify(this.$data, null, 2);
    }
  },
  template: require('../templates/race_preset_new.html')
});

