var Vue = require('vue');

module.exports = Vue.extend({
  props: {
    car: {},
    active: {
      default: 0
    }
  },
  computed: {
    livery () {
      return this.car.liveries[this.active];
    }
  },
  methods: {
    view_livery (index) {
      this.active = index;
    }
  },
  template: require('../templates/components/car.html'),
  components: {
    card: require('./card.js'),
    dropdown: require('vue-strap').dropdown
  }
});

