var Vue = require('vue');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return {
        content: this.$http.get('/api' + transition.to.path)
          .then(res => res.data)
      };
    }
  },
  data () {
    return {
      content: []
    };
  },
  computed: {
    grouped_tracks () {
      return _.reduce(this.content, (total, track) => {
        total[track.file_name] = total[track.file_name] || {};
        total[track.file_name].multiple_configurations = !_.isEmpty(track.file_name_secondary);
        total[track.file_name].visible_configuration = total[track.file_name].visible_configuration || track;
        total[track.file_name].configurations = total[track.file_name].configurations || [];
        total[track.file_name].configurations.push(track);
        return total;
      }, {});
    }
  },
  template: require('../templates/content_tracks.html'),
  components: {
    card: require('./card.js'),
    dropdown: require('vue-strap').dropdown
  }
});