var Vue = require('vue');
var VueRouter = require('vue-router');
var _ = require('lodash');
var hljs = require('highlight.js');

Vue.config.debug = true;

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
    return {
      io: {},
      system_stats: {
        uptime: 0,
        cpu_percent: 0,
        cpu: {
          avg_load: 0
        },
        ram: {
          total: 0,
          active: 0,
          used: 0
        },
        swap: {
          total: 0,
          used: 0
        },
        storage: {
          total: 0,
          used: 0
        },
        network: {
          in: 0,
          out: 0
        }
      }
    };
  },
  computed: {
    ram_used_percent () {
      return this.to_percent(this.system_stats.ram.total)(this.system_stats.ram.used);
    },
    ram_active_percent () {
      return this.to_percent(this.system_stats.ram.total)(this.system_stats.ram.active);
    },
    mem_active_size () {
      return this.convert_bytes(this.system_stats.ram.active);
    },
    mem_total_size () {
      return this.convert_bytes(this.system_stats.ram.total);
    },
    swap_used_percent () {
      return this.to_percent(this.system_stats.swap.total)(this.system_stats.swap.used);
    },
    swap_used_size () {
      return this.convert_bytes(this.system_stats.swap.used);
    },
    swap_total_size () {
      return this.convert_bytes(this.system_stats.swap.total);
    }
  },
  methods: {
    to_percent (a) {
      return (b) => {
        return (a / b) * 100;
      };
    },
    convert_bytes (bytes=0, show_extension=true, decimal=0) {
      var out, extension;

      if (bytes < 1024) {
        out = parseFloat(bytes).toFixed(decimal);
        extension = 'Bytes';
      } else if (bytes < 1048576) {
        out = (bytes / 1024).toFixed(decimal);
        extension = "KB";
      } else if (bytes < 1073741824) {
        out = (bytes / 1048576.1).toFixed(decimal);
        extension = "MB";
      } else {
        (bytes / 1073741824).toFixed(decimal);
        extension = "GB";
      }

      return out + extension;
    }
  },
  ready () {
    var self = this;

    this.$root.io.on('server_status', (data) => {
      this.$root.system_stats.cpu_percent = data.currentLoad.currentload;
      this.$root.system_stats.cpu.avg_load = data.currentLoad.avgload;
      this.$root.system_stats.ram.total = data.mem.total;
      this.$root.system_stats.ram.active = data.mem.active;
      this.$root.system_stats.ram.used = data.mem.used;
      this.$root.system_stats.swap.total = data.mem.swaptotal;
      this.$root.system_stats.swap.used = data.mem.swapused;
      this.$root.system_stats.storage.total = data.fsSize[0].size;
      this.$root.system_stats.storage.used = data.fsSize[0].used;
      this.$root.system_stats.network.in = data.networkStats.rx_sec;
      this.$root.system_stats.network.out = data.networkStats.tx_sec;
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
