var Vue = require('vue');
var _ = require('lodash');
var io = require('../util/io.js')();

module.exports = Vue.extend({
  name: 'install_content',
  props: {
    index: {
      default: _.uniqueId()
    }
  },
  data () {
    return {
      url: '',
      console_buffer: [],
      installing: false,
      installing_done: false,
      downloading: false,
      downloading_done: false,
      extracting: false,
      extracting_done: false,
      registering: false,
      registering_done: false
    };
  },
  computed: {
    is_list () {
      return !_.isUndefined(this.index);
    }
  },
  methods: {
    remove_row (index) {
      this.$dispatch('delete-install-row', index);
    },
    install () {
      io.emit('install:from_url', {
        id: this.index,
        url: this.url
      });
      this.installing = true;
    }
  },
  attached () {
    console.log(this.$data.index);

    io.on('install:update', (msg) => {
      // this.console_buffer.push(data.msg);
      if (msg.id == this.$data.index) this.console_buffer.push(msg.msg);
    });

    io.on('install:message', (msg) => {
      if (msg.id == this.$data.index) console.log(msg);
    });
  },
  ready () {
    io.emit('install:connect_socket', this.$data.index);
  },
  template: require('../templates/install_content.html')
});
