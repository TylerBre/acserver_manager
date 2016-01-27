var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter);
Vue.use(require('vue-resource'));
Vue.use(require('vue-validator'));

Vue.http.options.root = '/api';

Vue.transition('expand', {
  enterClass: 'expand-enter',
  leaveClass: 'expand-leave',
  type: 'transition'
});

Vue.transition('fade', {
  enterClass: 'fade-enter',
  leaveClass: 'fade-leave',
  type: 'transition'
});

var App = Vue.extend({
  data () {
    return {
      server: 0,
      io: {}
    }
  },
  ready () {
    this.$root.io.on('server_status', (data) => {
      this.$root.server = data.currentLoad.currentload;
    })
    // this.$root.emit('system_stats:listening');
  },
  attached () {
    this.$root.io = require('./util/io.js')();
  }
});

global.api = require('./api.js');

var router = new VueRouter({
  hashbang: false,
  history: true,
  linkActiveClass: 'active',
  saveScrollPosition: true,
  transitionOnLoad: true
});

router.map(require('./routes.js')(Vue));

router.start(App, '#app');
