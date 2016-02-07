var Vue = require('vue');
var _ = require('lodash');

module.exports = Vue.extend({
  name: 'track',
  props: {
    configurations: [],
    active: {
      default: 0
    }
  },
  computed: {
    visible_configuration () {
      return this.configurations[this.active];
    },
    multiple_configurations () {
      return this.configurations.length > 1;
    }
  },
  methods: {
    view_configuration (index) {
      this.active = index;
    }
  },
  template: require('../templates/components/track.html'),
  components: {
    card: require('./card.js'),
    dropdown: require('vue-strap').dropdown
  }
});