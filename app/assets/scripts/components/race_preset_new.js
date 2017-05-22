var fs = require('fs');
var path = require('path');

var server_cfg_template = fs.readFileSync(path.resolve(__dirname, '../templates/server_cfg.ini'), 'utf-8');
var Vue = require('vue');
var api = require('api');
var _ = require('lodash');

var weather_types = [
  "1_heavy_fog",
  "2_light_fog",
  "3_clear",
  "4_mid_clear",
  "5_light_clouds",
  "6_mid_clouds",
  "7_heavy_clouds"
];
var weather_collection = _.reduce(weather_types, (all, id) => {
  var name = _.chain(id)
    .words(/[a-zA-Z]+/g)
    .map(word => _.capitalize(word))
    .join(' ')
    .value();

  all.push({id, name})
  return all;
}, []);

module.exports = Vue.extend({
  route: {
    data (transition) {
      return this.$http
        .get('/api/content/tracks')
        .then(res => {
          this.tracks = res.data;
        });
    }
  },
  data () {
    return {
      cars: [],
      tracks: [],
      track: 1,
      weather: '3_clear',
      name: 'Untitled Race',
      password: 'my_password',
      admin_password: 'my_admin_password',
      practice_length: 30,
      practice_enabled: true,
      qualify_length: 10,
      qualify_enabled: true,
      qualify_max_wait: 120,
      race_laps: 10,
      race_race_over_timer: 120,
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
      dynamic_track_session_start: 90,
      dynamic_track_lap_gain: 22,
      loop: false,
      state: {
        show_cfg_preview: false,
        show_all_settings: false,
        show_car_list: false,
        show_more_settings: false
      },
      template: {
        server_cfg: _.template(server_cfg_template)
      },
      weather_collection
    };
  },
  computed: {
    server_cfg_preview () {
      return this.template.server_cfg(this);
    },
    tracks_flat () {
      return _(this.tracks).values().flatten().value();
    },
    cars_flat () {
      return _(this.cars).values().flatten().value();
    },
    track_obj () {
      return _.find(this.tracks_flat, {id: this.track});
    },
    config_track () {
      return this.track_obj.file_name_secondary;
    },
    stringified_cars () {
      var out = _.map(this.cars, car => car.file_name);
      out = JSON.stringify(out);
      out = out.replace('[', '');
      out = out.replace(']', '');
      out = out.replace(/"/g, '');
      return out;
    }
  },
  methods: {
    remove_car (car) {
      if (this.cars.indexOf(car) >= 0) {
        this.cars.splice(this.cars.indexOf(car), 1);
      }
    },
    save () {
      api.race_preset.save(null, _.omit(this.$data, ['tracks']))
        .then(res => console.log(res.data))
        .catch(err => console.error(err));
    }
  },
  events: {
    'selected-cars-update' (cars) {
      this.cars = cars;
    }
  },
  template: require('../templates/race_preset_new.html'),
  components: {
    car_list: require('./car_list.js'),
    carousel: require('vue-strap').carousel,
    modal: require('vue-strap').modal,
    slider: require('vue-strap').slider
  }
});