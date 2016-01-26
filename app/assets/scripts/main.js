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
  '/test': {
    component: require('./components/test.js')
  }
});

router.start(App, '#app');
