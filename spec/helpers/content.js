var assert = require('should');
var _ = require('lodash');

var archive = require('../../app/helpers/content.js');

describe('content helper', () => {
  describe('car', () => {
    it('should find metadata for a car installed on the server');
    it('and the data should match a pre-determined format');
  });

  describe('track', () => {
    it('should find metadata for a track installed on the server');
    it('and the data should match a pre-determined format');
  });

  describe('cars', () => {
    it('should look through all installed cars and pull metadata for each car');
  });

  describe('tracks', () => {
    it('should look through all installed tracks and pull metadata for each track');
  });
});
