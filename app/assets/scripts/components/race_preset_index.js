var Vue = require('vue');
var api = require('api');
var _ = require('lodash');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return this.$http
        .get('/api/race_preset')
        .then(res => {
          this.race_presets = res.data;
        });
    }
  },
  data () {
    return {
      race_presets: []
    };
  },
  computed: {
    stringified_data () {
      return JSON.stringify(this.race_presets, null, 2);
    }
  },
  template: require('../templates/race_preset_index.html')
});