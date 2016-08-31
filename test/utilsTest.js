'use strict';
var expect = require('chai').expect;
var utils = require('./../src/utils');

describe('nmPhoneUtils', function() {
  describe('contains', function() {
    it('should return true if a collection contains a value and false if it doesn\'t', function(done) {

      expect(utils.contains([1,2,3], 1)).to.equal(true);
      expect(utils.contains([1,2,3], '1')).to.equal(true);
      expect(utils.contains([1,2,3], 5)).to.equal(false);
      expect(utils.contains([1,2,3], '5')).to.equal(false);

      done();
    });
  });

  describe('isValidPhoneNumber', function() {
    it('should tell use if a phone number is valid based on our format', function(done) {

      expect(utils.isValidPhoneNumber('+971-00-000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('00971-00-000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('+971-0000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('+97100000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('+9710000000')).to.equal(true);

      expect(utils.isValidPhoneNumber('+971-00-000')).to.equal(false);
      expect(utils.isValidPhoneNumber('00971-00-000')).to.equal(false);
      expect(utils.isValidPhoneNumber('aaa')).to.equal(false);

      done();
    });
  });

  describe('parsePhone', function() {
    it('should tell use if a phone number is valid based on our format', function(done) {

      expect(utils.parsePhone('+971-52-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "52",
          "countryCode": "971",
          "number": "000000"
        },
        "fkCountry": "AE"
      });

      expect(utils.parsePhone('+966-00-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "00",
          "countryCode": "966",
          "number": "000000"
        },
        "fkCountry": "SA"
      });

      expect(utils.parsePhone('+973-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "973",
          "number": "000000"
        },
        "fkCountry": "BH"
      });

      expect(utils.parsePhone('+973000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "973",
          "number": "000000"
        },
        "fkCountry": "BH"
      });

      expect(utils.parsePhone('+not-00-valid', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      });

      expect(utils.parsePhone('', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      });

      expect(utils.parsePhone('+999-00-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      });

      done();
    });
  });

  describe('validateCountry', function() {
    it('should return true or false if the countryId is valid/invalid', function(done) {

      expect(utils.validateCountry('', phoneSettings)).to.deep.equal({
        valid: false,
        errors: ['empty']
      });

      expect(utils.validateCountry('AE', phoneSettings)).to.deep.equal({
        valid: true
      });

      done();
    });
  });

  describe('validateCarrierCode', function() {
    it('should return true or false if the carrierCode is valid/invalid', function(done) {

      expect(utils.validateCarrierCode('', '', phoneSettings)).to.deep.equal({
        valid: false
      });

      expect(utils.validateCarrierCode('50', '', phoneSettings)).to.deep.equal({
        valid: false
      });

      expect(utils.validateCarrierCode('50', 'notcountry', phoneSettings)).to.deep.equal({
        valid: false
      });

      expect(utils.validateCarrierCode('', 'AE', phoneSettings)).to.deep.equal({
        valid: false,
        errors: ['empty']
      });

      expect(utils.validateCarrierCode('', 'BH', phoneSettings)).to.deep.equal({
        valid: true,
        "errors": []
      });

      expect(utils.validateCarrierCode('52', 'SA', phoneSettings)).to.deep.equal({
        valid: false
      });

      expect(utils.validateCarrierCode('52', 'AE', phoneSettings)).to.deep.equal({
        valid: true
      });

      done();
    });
  });

  describe('validateNumber', function() {
    it('should return true or false if the number is valid/invalid', function(done) {

      expect(utils.validateNumber()).to.deep.equal({
        valid: false,
        errors: ['empty']
      });

      expect(utils.validateNumber('abc')).to.deep.equal({
        valid: false,
        errors: ['notNumeric']
      });

      expect(utils.validateNumber('01', 3)).to.deep.equal({
        valid: false,
        errors: ['minlengthInvalid']
      });

      expect(utils.validateNumber('01234', 3, 4)).to.deep.equal({
        valid: false,
        errors: ['maxlengthInvalid']
      });

      expect(utils.validateNumber('5196853', 7, 7)).to.deep.equal({
        valid: true
      });

      done();
    });
  });
});

var phoneSettings = {
  "ae": {
    "iso2Code":"AE",
    "phoneCodes": {
      "country":971,
      "carrierCodes":[50,52,54,55,56],
      "maxlength":7,
      "minlength":7
    }
  },
  "sa": {
    "iso2Code":"SA",
    "phoneCodes": {
      "country":966,
      "carrierCodes":[50,53,54,55,56,57,58,59],
      "maxlength":7,
      "minlength":7
    },
  },
  "bh": {
    "iso2Code":"BH",
    "name":"Bahrain",
    "phoneCodes": {
      "country":973,
      "carrierCodes":false,
      "maxlength":8,
      "minlength":8
    },
  }
};
