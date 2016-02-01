var Vue = require('vue');
var _ = require('lodash');

module.exports = Vue.extend({
  name: 'console',
  props: {
    buffer: {
      default: []
    },
    height: {
      default: 157
    }
  },
  data () {
    return {
      $console_frame: '',
      dom_buffer: []
    };
  },
  methods: {
    repaint () {
      // hack to wait for a dom repaint so we get the updated scroll position
      setTimeout(() => {
        this.$console_frame.scrollTop = this.$console_frame.scrollHeight;
      }, 1);
    }
  },
  ready () {
    this.$watch('buffer', (buffer) => {
      var msg = buffer[buffer.length - 1];
      if (msg !== this.dom_buffer[this.dom_buffer.length - 1]) {
        this.dom_buffer.push(msg);
        this.repaint();
      }
      return buffer;
    });

  },
  attached () {
    this.$console_frame = this.$el.getElementsByClassName('console-frame')[0];
  },
  template: require('../templates/components/console.html')
});
