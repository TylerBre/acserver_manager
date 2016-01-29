var Waterline = require('waterline');
module.exports = Waterline.Collection.extend({
  identity: 'race_preset',
  connection: 'psql',

  attributes: {
    name: {
      type: 'string',
      defaultsTo: 'Untitled'
    },
    track: {
      model: 'track'
    },
    allowed_tires_out: {
      type: 'integer',
      defaultsTo: 4
    },
    abs: {
      type: 'boolean',
      defaultsTo: 0
    },
    tcs: {
      type: 'boolean',
      defaultsTo: 0
    },
    stm: {
      type: 'boolean',
      defaultsTo: 0
    },
    auto_clutch: {
      type: 'boolean',
      defaultsTo: 1
    },
    tire_wear_rate: {
      type: 'integer',
      defaultsTo: 100
    },
    fuel_consumption_rate: {
      type: 'integer',
      defaultsTo: 100
    },
    damage_multiplier: {
      type: 'integer',
      defaultsTo: 100
    },
    voting_quorum: {
      type: 'integer',
      defaultsTo: 66
    },
    vote_duration: {
      type: 'integer',
      defaultsTo: 45
    },
    kick_quorum: {
      type: 'integer',
      defaultsTo: 66
    },
    admin_password: {
      type: 'string',
      defaultsTo: null
    },
    tire_blankets_allowed: {
      type: 'boolean',
      defaultsTo: 0
    },
    dynamic_track_session_start: {
      type: 'integer',
      defaultsTo: 99
    },
    dynamic_track_randomness: {
      type: 'integer',
      defaultsTo: 1
    },
    dynamic_track_lap_gain: {
      type: 'integer',
      defaultsTo: 22
    },
    dynamic_track_session_transfer: {
      type: 'integer',
      defaultsTo: 20
    },
    practice_enabled: {
      type: 'boolean',
      defaultsTo: false
    },
    practice_length: {
      type: 'integer',
      defaultsTo: 30
    },
    practice_wait: {
      type: 'integer',
      defaultsTo: null
    },
    qualify_enabled: {
      type: 'boolean',
      defaultsTo: false
    },
    qualify_length: {
      type: 'integer',
      defaultsTo: 15
    },
    qualify_wait: {
      type: 'integer',
      defaultsTo: null
    },
    race_laps: {
      type: 'integer',
      defaultsTo: 10
    },
    race_over_timer: {
      type: 'integer',
      defaultsTo: 120
    },
    session_wait: {
      type: 'integer',
      defaultsTo: null
    },
  }
});
