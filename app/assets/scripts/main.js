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

var App = Vue.extend({});
var router = new VueRouter({
  hashbang: false,
  history: true,
  linkActiveClass: 'active',
  saveScrollPosition: true,
  transitionOnLoad: true
});

router.map({
  '/': {
    component: require('./components/dashboard.js')
  },
  '/content': {
    name: 'content_index',
    component: require('./components/content_index.js')
  },
  '/race_presets': {
    name: 'race_presets_index',
    component: require('./components/content_index.js')
  },
  '/race_presets/new': {
    name: 'race_presets_new',
    component: require('./components/race_presets_new.js')
  }
});

router.start(App, '#app');
