var Vue = require('vue');
var _ = require('lodash');
var io = require('../util/io.js')();

module.exports = Vue.extend({
  name: 'install_content',
  props: {
    socket_id: {
      default: _.uniqueId()
    }
  },
  data () {
    return {
      url: '',
      console_buffer: [],
      downloading: false,
      downloading_progress: "0%",
      downloading_done: false,
      extracting: false,
      extracting_done: false,
      registering: false,
      registering_done: false,
      error_msg: '',
      has_error: false
    };
  },
  computed: {
    is_list () {
      return !_.isUndefined(this.socket_id);
    },
    in_progress () {
      return this.downloading || this.extracting || this.registering;
    },
    completed () {
      return this.downloading_done && this.extracting_done && this.registering_done;
    },
    installing () {
      return this.in_progress && !this.completed;
    }
  },
  methods: {
    remove_row (socket_id) {
      this.$dispatch('delete-install-row', socket_id);
      // add call to cancel/delete the content install if in progress.
    },
    install () {
      io.emit('install:from_url', {
        id: this.socket_id,
        url: this.url
      });
      this.installing = true;
    },
    reset_status () {

    }
  },
  attached () {
    var self = this;

    io.on('install:update:download', (msg) => filter_update_msg(msg, (msg) => {
      this.downloading = true;
      this.downloading_progress = msg;
    }));

    io.on('install:update:extraction', (msg) => filter_update_msg(msg, (msg) => {
      this.extracting = true;
      // this.downloading_progress = msg;
    }));

    io.on('install:update:error', (msg) => filter_update_msg(msg, (msg) => {
      console.log(msg);
      this.has_error = true;
      this.error_msg = msg;
    }));

    function filter_update_msg (msg, fn) {
      if (msg.id == self.$data.socket_id) {
        self.console_buffer.push(msg.msg);
        fn(msg.msg);
      }
    }

    io.on('install:message', (msg) => filter_update_msg(msg, (msg) => console.log(msg)));
  },
  ready () {
    io.emit('install:connect_socket', this.$data.socket_id);
  },
  template: require('../templates/install_content.html'),
  components: {
    console: require('./console.js')
  }
});
