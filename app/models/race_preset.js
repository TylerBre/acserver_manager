module.exports = (sequelize, DataTypes) => {
  return sequelize.define('race_preset', {
    name: {
      type: DataTypes.STRING,
      defaultValue: 'Untitled'
    },
    allowed_tires_out: {
      type: DataTypes.INTEGER,
      defaultValue: 4
    },
    abs: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tcs: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    auto_clutch: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tire_wear_rate: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    fuel_consumption_rate: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    damage_multiplier: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    voting_quorum: {
      type: DataTypes.INTEGER,
      defaultValue: 66
    },
    vote_duration: {
      type: DataTypes.INTEGER,
      defaultValue: 45
    },
    kick_quorum: {
      type: DataTypes.INTEGER,
      defaultValue: 66
    },
    admin_password: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    tire_blankets_allowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dynamic_track_session_start: {
      type: DataTypes.INTEGER,
      defaultValue: 99
    },
    dynamic_track_randomness: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    dynamic_track_lap_gain: {
      type: DataTypes.INTEGER,
      defaultValue: 22
    },
    dynamic_track_session_transfer: {
      type: DataTypes.INTEGER,
      defaultValue: 20
    },
    practice_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    practice_length: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    practice_wait: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    qualify_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    qualify_length: {
      type: DataTypes.INTEGER,
      defaultValue: 15
    },
    qualify_wait: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    race_laps: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    race_over_timer: {
      type: DataTypes.INTEGER,
      defaultValue: 120
    },
    session_wait: {
      type: DataTypes.INTEGER,
      defaultValue: null
    }
  }, {
    classMethods: {
      associate (models) {
        this.hasOne(models.track);
      }
    }
  });
};
