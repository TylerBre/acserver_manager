'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

   queryInterface.addColumn(
     'race_presets',
     'qualify_max_wait',
     {
       type: Sequelize.INTEGER,
       defaultValue: 120
     }
   );

   queryInterface.addColumn(
     'race_presets',
     'loop',
     {
       type: Sequelize.BOOLEAN,
       defaultValue: false
     }
   );

   queryInterface.addColumn(
     'race_presets',
     'weather',
     {
       type: Sequelize.STRING,
       defaultValue: '3_clear'
     }
   );

   queryInterface.addColumn(
     'race_presets',
     'password',
     {
       type: Sequelize.STRING,
       defaultValue: ''
     }
   );

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    queryInterface.removeColumn('race_presets', 'qualify_max_wait')
    queryInterface.removeColumn('race_presets','loop');
    queryInterface.removeColumn('race_presets','weather');
    queryInterface.removeColumn('race_presets','password');
  }
};
