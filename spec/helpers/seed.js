var assert = require('should');
var _ = require('lodash');

var archive = require('../../app/helpers/seed.js');

describe('seed helper', () => {
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
    it('should copy ui data for car skins from a game install to the seed directory');
    it('should only specific files');
    it('should only copy skins for official cars');
    it('should only copy skins that were made by kunos');
  });
});
