var Vue = require('vue');
var api = require('api');
var _ = require('lodash');

module.exports = Vue.extend({
  template: require('../templates/content_new.html'),
  data () {
    return {
      install_fields: [_.uniqueId()]
    };
  },
  methods: {
    add_row () {
      this.install_fields.push(_.uniqueId());
    }
  },
  events: {
    'delete-install-row' (index) {
      this.install_fields.splice(index, 1);
    }
  },
  components: {
    install_content: require('./install_content.js')
  }
});
