var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return {
        tracks: this.$http.get('/api' + transition.to.path)
          .then(res => res.data)
      };
    }
  },
  data () {
    return {
      tracks: []
    };
  },
  template: require('../templates/content_tracks.html'),
  components: {
    track: require('./track.js')
  }
});