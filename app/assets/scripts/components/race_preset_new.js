var fs = require('fs');
var path = require('path');

var server_cfg_template = fs.readFileSync(path.resolve(__dirname, '../templates/server_cfg.ini'), 'utf-8');
var Vue = require('vue');
var api = require('api');
var _ = require('lodash');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return this.$http.get('/api/content').then((res) => res.data);
    }
  },
  data () {
    return {
      car_list: [],
      cars: [],
      tracks: [],
      track: 1,
      name: 'Untitled Race',
      practice_length: 20,
      practice_enabled: true,
      qualify_length: 8,
      qualify_enabled: 20,
      race_laps: 8,
      race_race_over_timer: 60,
      allowed_tires_out: 4,
      abs: true,
      tcs: true,
      stm: true,
      auto_clutch: true,
      tire_wear_rate: 100,
      fuel_consumption_rate: 100,
      damage_multiplier: 100,
      tire_blankets_allowed: true,
      session_wait: 60,
      voting_quorum: 50,
      kick_quorum: 50,
      vote_duration: 15,
      dynamic_track_session_start: 80,
      dynamic_track_lap_gain: 22,
      show_more_settings: false,
      server_cfg_template: _.template(server_cfg_template),
      show_cfg_preview: false,
      show_all_settings: false
    };
  },
  computed: {
    server_cfg_preview () {
      return this.server_cfg_template(this);
    },
    tracks_flat () {
      return _(this.tracks).values().flatten().value();
    },
    track_obj () {
      return _.find(this.tracks_flat, {id: this.track});
    },
    config_track () {
      return this.track_obj.file_name_secondary;
    }
  },
  methods: {
    save () {
      api.race_preset.save(null, _.omit(this.$data, ['cars', 'tracks'])).then((res) => {
        debugger;
      }).catch(err => console.error(err));
    }
  },
  template: require('../templates/race_preset_new.html')
});

