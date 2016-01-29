var Vue = require('vue');
var VueRouter = require('vue-router');
var _ = require('lodash');
var hljs = require('highlight.js');

Vue.use(VueRouter);
Vue.use(require('vue-resource'));
Vue.use(require('vue-validator'));

Vue.http.options.root = '/api';

// filters
Vue.filter('syntax_highlight', (code, syntax='markdown') => {
  var output = hljs.highlight(syntax, code, true);
  return `<pre class="hljs"><code class="${syntax}">${output.value}</span></pre>`;

});

// transitions
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
    return {};
  },
  ready () {
    this.$root.io.on('server_status', (data) => {
      this.$root.server = data.currentLoad.currentload;
    });
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

router.afterEach(function (transition) {
  console.log('Successfully navigated to: ' + transition.to.path);
});

router.map(require('./routes.js')(Vue));

router.start(App, '#app');
