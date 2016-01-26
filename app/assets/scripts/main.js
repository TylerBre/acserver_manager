var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter);
Vue.use(require('vue-resource'));
Vue.use(require('vue-async-data'));
Vue.use(require('vue-validator'));

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
  }
});

router.start(App, '#app');
