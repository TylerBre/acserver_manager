var Vue = require('vue');
var api = require('api');
var _ = require('lodash');

module.exports = Vue.extend({
  template: require('../templates/content_new.html'),
  data () {
    return {
      socket_ids: [this.generate_id()]
    };
  },
  methods: {
    add_row () {
      this.socket_ids.push(this.generate_id());
    },
    generate_id () {
      return _.chain().range(5).reduce((total) => total + _.random(1, 9), '').value() * 1;
    }
  },
  events: {
    'delete-install-row' (index) {
      this.socket_ids.splice(index, 1);
    }
  },
  components: {
    install_content: require('./install_content.js')
  }
});
