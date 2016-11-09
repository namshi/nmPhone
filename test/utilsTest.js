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
      expect(utils.isValidPhoneNumber('+39-000-0000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('+390000000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('0039-000-0000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('00390000000000')).to.equal(true);

      expect(utils.isValidPhoneNumber('0039000-0000000')).to.equal(false);
      expect(utils.isValidPhoneNumber('+39000-0000000')).to.equal(false);
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
          "carrierCode": 52,
          "countryCode": 971,
          "number": "000000"
        },
        "fkCountry": "AE"
      });

      expect(utils.parsePhone('+966-50-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": 50,
          "countryCode": 966,
          "number": "000000"
        },
        "fkCountry": "SA"
      });

      expect(utils.parsePhone('+973-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": 973,
          "number": "000000"
        },
        "fkCountry": "BH"
      });

      expect(utils.parsePhone('+973000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": 973,
          "number": "000000"
        },
        "fkCountry": "BH"
      });

      expect(utils.parsePhone('+not-50-valid', phoneSettings)).to.deep.equal({
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

      expect(utils.parsePhone('+999-50-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      });

      expect(utils.parsePhone('+971-52-0000000', phoneSettings, 'sa')).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": 966,
          "number": ""
        },
        "fkCountry": "sa"
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

  describe('extractNumbers', function() {
    it('should return only numbers inside a string and an empty string if none is found', function(done) {

      expect(utils.extractNumbers('h8h48hf8h4hf38h92')).to.equal('848843892');
      expect(utils.extractNumbers('12345')).to.equal('12345');
      expect(utils.extractNumbers('')).to.equal('');
      expect(utils.extractNumbers(undefined)).to.equal('');
      expect(utils.extractNumbers('hello')).to.equal('');

      done();
    });
  });

  describe('getFormattedNumber', function() {
    it('should return the phone number as a tring given an object', function(done) {

      var phoneData = {
        "cellTokens": {
          "carrierCode": 50,
          "countryCode": 971,
          "number": "0000000"
        },
        "fkCountry": "AE"
      };

      expect(utils.getFormattedNumber(phoneData)).to.equal('+971-50-0000000');

      done();
    });

    it('should return the phone number as a tring given an object without carrier code', function(done) {

      var phoneData = {
        "cellTokens": {
          "carrierCode": "",
          "countryCode": 444,
          "number": "0000000"
        },
        "fkCountry": ""
      };

      expect(utils.getFormattedNumber(phoneData)).to.equal('+444-0000000');

      done();
    });

    it('should return an empty string for an empty object or empty fields', function(done) {

      var phoneData = {
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      };

      expect(utils.getFormattedNumber(phoneData)).to.equal('');
      expect(utils.getFormattedNumber({})).to.equal('');

      done();
    });
  });

  describe('isPhoneDataValid', function() {
    it('should return true for a valid phoneDataObject', function(done) {

      var phoneData = {
        "cellTokens": {
          "carrierCode": 50,
          "countryCode": 971,
          "number": "0000000"
        },
        "fkCountry": "AE"
      };

      expect(utils.isPhoneDataValid(phoneData, phoneSettings)).to.equal(true);

      done();
    });

    it('should return true for a valid phoneDataObject', function(done) {

      var phoneData = {
        "cellTokens": {
          "carrierCode": "",
          "countryCode": 973,
          "number": "000000"
        },
        "fkCountry": "BH"
      };

      expect(utils.isPhoneDataValid(phoneData, phoneSettings)).to.equal(true);

      done();
    });

    it('should return false for an invalid phoneData object', function(done) {

      expect(utils.isPhoneDataValid({}, phoneSettings, 7, 7)).to.equal(false);
      expect(utils.isPhoneDataValid({"cellTokens": {}}, phoneSettings, 7, 7)).to.equal(false);
      expect(utils.isPhoneDataValid({"fkCountry": ""}, phoneSettings, 7, 7)).to.equal(false);
      expect(utils.isPhoneDataValid({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "971",
          "number": "0000000"
        },
        "fkCountry": "AE"
      }, phoneSettings, 7, 7)).to.equal(false);
      expect(utils.isPhoneDataValid({
        "cellTokens": {
          "carrierCode": "50",
          "countryCode": "",
          "number": "0000000"
        },
        "fkCountry": ""
      }, phoneSettings, 7, 7)).to.equal(false);
      expect(utils.isPhoneDataValid({
        "cellTokens": {
          "carrierCode": "50",
          "countryCode": "971",
          "number": ""
        },
        "fkCountry": "AE"
      }, phoneSettings, 7, 7)).to.equal(false);
      expect(utils.isPhoneDataValid({
        "cellTokens": {
          "carrierCode": "50",
          "countryCode": "971",
          "number": "000"
        },
        "fkCountry": "AE"
      }, phoneSettings, 7, 7)).to.equal(false);
      expect(utils.isPhoneDataValid({
        "cellTokens": {
          "carrierCode": "50",
          "countryCode": "971",
          "number": "00000000"
        },
        "fkCountry": "AE"
      }, phoneSettings, 7, 7)).to.equal(false);

      /** NOTE: TO BE FIXED. This will end up returning true ! */
      // expect(utils.isPhoneDataValid({
      //   "cellTokens": {
      //     "carrierCode": "50",
      //     "countryCode": "",
      //     "number": "0000000"
      //   },
      //   "fkCountry": "AE"
      // }, phoneSettings, 7, 7)).to.equal(false);

      done();
    });

    it('should return an empty string for an empty object or empty fields', function(done) {

      var phoneData = {
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      };

      expect(utils.getFormattedNumber(phoneData)).to.equal('');
      expect(utils.getFormattedNumber({})).to.equal('');

      done();
    });
  });

  describe('loadCountryCodes', function() {
    it('should return the list of country codes in the settings', function(done) {

      expect(utils.loadCountryCodes(phoneSettings)).to.deep.equal([971, 966, 973]);

      done();
    });
  });

  describe('getCountryPhoneSettings', function() {
    it('should return the country phone setting object for the given country, or return undefined', function(done) {

      expect(utils.getCountryPhoneSettings(phoneSettings, 971)).to.deep.equal({
        "carrierCodes": [50,52,54,55,56],
        "country": 971,
        "maxlength": 7,
        "minlength": 7
      });
      expect(utils.getCountryPhoneSettings(phoneSettings, 39)).to.equal(undefined);

      done();
    });
  });

  describe('getNumericValidator', function() {
    it('should return a function that will filter out not numeric characters', function(done) {

      var test = function(result) {
        expect(result).to.equal('012345');
        done();
      }

      utils.getNumericValidator(test)('a0123b45');
    });

    it('should not call the callback if the the input it is already numeric', function(done) {
      var counter = 0;
      var test = function(result) {
        counter++;
        expect(result).to.equal('012345');
      }

      var result =utils.getNumericValidator(test)('a0123b45');
      result = utils.getNumericValidator(test)('012345');

      expect(result).to.equal('012345');
      expect(counter).to.equal(1);
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
