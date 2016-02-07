var Vue = require('vue');

module.exports = Vue.extend({
  name: 'card',
  props: {
    image: {
      default: ''
    },
    title: {
      default: ''
    },
    image_position: {
      default: 'center'
    }
  },
  computed: {
    has_title () {
      return this.title.length > 0;
    }
  },
  template: require('../templates/components/card.html')
});
