var should = require('should');
var seed = require('../../app/helpers/seed.js');

describe('seed helper', () => {
  // this helper is meant to be run sparingly, don't run it through CI
  if (!process.env.CONTENT_DIR) return true;

  before(() => {
    seed = new seed(process.env.CONTENT_DIR);
  });

  it('should have a specific api', () => {
    seed.should.have.properties('official_cars', 'official_tracks', 'official_liveries');
  });

  describe('when creating a list of installed cars', () => {
    it('should compile a list of all installed cars');
    it('and the list should match a pre-determined format');
  });

  describe('when creating a list of installed tracks', () => {
    it('should compile a list of all installed tracks');
    it('and the list should match a pre-determined format');
  });

  describe('when creating a list of installed skins', () => {
    it('should compile a list of all installed cars');
    it('and the list should match a pre-determined format');
  });

  describe('when seed official cars', () => {
    it('should copy ui data for cars from a game install to the seed directory');
    it('should only specific files');
    it('should only copy official content');
  });

  describe('when seed official tracks', () => {
    it('should copy ui data for tracks from a game install to the seed directory');
    it('should only specific files');
    it('should only copy official content');
  });

  describe('when seed official liveries', () => {
    // it('should be able to compile a list of liveries', () => {
    //   return seed.create_car_liveries_list()
    //     .should.eventually.be.a.Object;
    // });
    it('should copy ui data for car skins from a game install to the seed directory', () => {
      return seed.official_liveries()
        .should.eventually.be.a.Array;
    });
    it('should only copy skins for official cars');
    it('should only copy skins that were made by kunos');
  });
});
