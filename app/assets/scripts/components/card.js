var Vue = require('vue');

module.exports = Vue.extend({
  name: 'card',
  props: {
    image: {
      default: ''
    },
    title: {
      default: ''
    }
  },
  computed: {
    has_title () {
      return this.title.length > 0;
    }
  },
  template: require('../templates/components/card.html')
});
