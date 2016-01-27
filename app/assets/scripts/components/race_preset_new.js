var Vue = require('vue');
var api = require('api');

module.exports = Vue.extend({
  route: {
    data (transition) {
      return this.$http.get('/api/content').then((res) => res.data);
    }
  },
  data () {
    return {
      track: null,
      car_list: [],
      cars: [],
      tracks: [],
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
      tyre_blankets_allowed: true,
      session_wait: 60,
      voting_quorum: 50,
      kick_quorum: 50,
      vote_duration: 15,
      dynamic_track_session_start: 80,
      dynamic_track_lap_gain: 22,
      show_more_settings: false
    };
  },
  computed: {
    stringified_data () {
      return JSON.stringify(this.$data, null, 2);
    }
  },
  methods: {
    save () {
      debugger;
      api.race_preset.save(null, this).then((res) => {
        debugger;
      }, (err) => {
        debugger;
      })
    }
  },
  template: require('../templates/race_preset_new.html')
});

