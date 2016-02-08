'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    queryInterface.addIndex('liveries', ['car_id']);
    queryInterface.addIndex('liveries', ['thumbnail_id']);
    queryInterface.addIndex('liveries', ['preview_id']);
    queryInterface.addIndex('liveries', ['dlc_id']);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    queryInterface.removeIndex('liveries', ['car_id']);
    queryInterface.removeIndex('liveries', ['thumbnail_id']);
    queryInterface.removeIndex('liveries', ['preview_id']);
    queryInterface.removeIndex('liveries', ['dlc_id']);
  }
};
