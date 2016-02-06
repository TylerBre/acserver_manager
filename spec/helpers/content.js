var should = require('should');
var content = require('../../app/helpers/content.js');

describe('content helper', () => {
  describe('car', () => {
    var name = 'abarth500';
    var car = content.car(name);

    it('should return an array containing the car data', () => {
      return car.should.eventually.be.instanceOf(Array).and.have.lengthOf(1);
    });

    it('should find the correct car', () => {
      return car.then(data => data[0])
        .should.eventually.have.property('file_name').eql(name);
    });

    it('should find metadata for a car installed on the server', () => {
      return car.then(data => data[0].data)
        .should.eventually.have.properties('name', 'brand', 'description');
    });

    it('and the data should match a pre-determined format', () => {
      return car.then(data => data[0])
        .should.eventually.have.properties('file_name', 'data', 'logo', 'official', 'resource_path');
    });
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
