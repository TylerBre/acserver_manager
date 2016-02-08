'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    queryInterface.addIndex('cars', ['logo_id']);
    queryInterface.addIndex('cars', ['dlc_id']);
    queryInterface.addIndex('tracks', ['outline_id']);
    queryInterface.addIndex('tracks', ['preview_id']);
    queryInterface.addIndex('tracks', ['dlc_id']);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    queryInterface.removeIndex('cars', ['logo_id']);
    queryInterface.removeIndex('cars', ['dlc_id']);
    queryInterface.removeIndex('tracks', ['outline_id']);
    queryInterface.removeIndex('tracks', ['preview_id']);
    queryInterface.removeIndex('tracks', ['dlc_id']);
  }
};
