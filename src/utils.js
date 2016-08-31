'use strict';

var _ = require('lodash');

/**
 * Uses abstract comparison (==) NOT strict comparison (===)
 */
function contains(list, item) {
  return _(list).map(_.toString).includes(_.toString(item));
};

var emptyPhoneObject = {
  fkCountry: '',
  cellTokens: {
    countryCode: '',
    carrierCode: '',
    number: ''
  }
};

/**
 * @see https://www.debuggex.com/r/tcX_Ez3vptR8n0Ff
 */
var phoneRegex = /^[00|\+]+([0-9]{2,3})(\-([0-9]{1,2}))?[\-]?([0-9]{6,8})$/;

var nmPhoneUtils = {
  contains: contains,

  /**
   * Will verfy that a given value is in a phone number format.
   * The format is defined by a regex (see phoneRegex variable)
   *
   * @param  {Mixed} value
   * @return {Boolean}
   */
  isValidPhoneNumber: function(value) {
    return phoneRegex.test(value);
  },

  /**
   * Will parse a phoneNumber based on it matches a regex
   * defined in the phoneRegex variable.
   *
   * If everything is fine it returns an object like this:
   * {
   *   fkCountry: 'AE',
   *   cellTokens: {
   *     countryCode: '971',
   *     carrierCode: '50',
   *     number: '0000000'
   *   }
   * };
   *
   * IF there are any errors it will return the same object
   * but all the values are going to be empty.
   */
  parsePhone: function(phone, phoneSettings) {
    if (!phone || !phoneRegex.test(phone)) {
      return emptyPhoneObject;
    }

    var matches = phone.match(phoneRegex);
    var countryCode = matches[1];
    var phoneCountryConfig = _.find(phoneSettings, function(setting) {
      return setting.phoneCodes.country == countryCode;
    });

    if (!phoneCountryConfig) {
      return emptyPhoneObject;
    }

    var carrierCode = matches[3] || '';
    var number = matches[4];

    return {
      fkCountry: phoneCountryConfig.iso2Code,
      cellTokens: {
        countryCode: countryCode,
        carrierCode: carrierCode,
        number: number
      }
    };
  },

  /**
   * Given an iso2code for a country it will try to find it in the
   * phoneSettings object that defines the countries you want to accept.
   *
   * It will return an object with a `valid` property (boolean), and if that is false an `errors` property
   * {
   *   valid: true/false,
   *   errors: [...] // this is optional
   * }
   *
   * the errors array will contain strings representing what was not valid.
   *
   * Fot the coutry validation it can contain only 'empty'
   *
   * @param  {String} countryId
   * @param  {Object} phoneSettings
   * @return {Object}
   */
  validateCountry: function(countryId, phoneSettings) {
    if (!countryId) {
      return {valid: false, errors: ['empty']};
    }

    return {
      valid: !!(phoneSettings[countryId.toLowerCase()] && phoneSettings[countryId.toLowerCase()].phoneCodes)
    };
  },

  /**
   * Given an iso2code for a country and a carrier code
   * it will try to find it in the phoneSettings object that
   * defines the countries and carriers you want to accept.
   *
   * It will return an object with a `valid` property (boolean), and if that is false an `errors` property
   * {
   *   valid: true/false,
   *   errors: [...] // this is optional
   * }
   *
   * the errors array will contain strings representing what was not valid.
   *
   * Fot the carrier validation it can contain only 'empty'
   *
   * @param  {String} carrierCode
   * @param  {String} countryId
   * @param  {Object} phoneSettings
   * @return {Object}
   */
  validateCarrierCode: function(carrierCode, countryId, phoneSettings) {
    if (!countryId) {
      return {
        valid: false
      };
    }

    if (!phoneSettings[countryId.toLowerCase()]) {
      return {
        valid: false
      };
    }

    var phoneCodes = phoneSettings[countryId.toLowerCase()].phoneCodes;

    if (phoneCodes === undefined) {
      return {valid: false};
    }

    if (!carrierCode) {
      var errors = (phoneCodes.carrierCodes === false) ? [] : ['empty'];
      return {
        valid: (phoneCodes.carrierCodes === false),
        errors: errors
      };
    }

    return {
      valid: contains(phoneCodes.carrierCodes, carrierCode)
    };
  },

  /**
   * Checks if a number is numeric and
   * if it matches the min and max length constraints.
   *
   * It will return an object with a `valid` property (boolean), and if that is false an `errors` property
   * {
   *   valid: true/false,
   *   errors: [...] // this is optional
   * }
   *
   * the errors array will contain strings representing what was not valid.
   *
   * Fot the carrier validation it can contain: 'empty', 'notNumeric', 'minlengthInvalid', 'maxlengthInvalid'
   *
   * @param  {Number} number
   * @param  {Number} min     Min number length
   * @param  {Number} max     Max number length
   * @return {Object}
   */
  validateNumber: function(number, min, max) {
    if (!number) {
      return {
        valid: false,
        errors: ['empty']
      };
    }

    if (!/[\d]+/g.test(number)) {
      return {
        valid: false,
        errors: ['notNumeric']
      };
    }

    if (number.length < min) {
      return {
        valid: false,
        errors: ['minlengthInvalid']
      };
    }

    if (number.length > max) {
      return {
        valid: false,
        errors: ['maxlengthInvalid']
      };
    }

    return {
      valid: true
    };
  },

  /**
   * Removes all non numeric chars from a string.
   *
   * @param  {String} value
   * @return {String}
   */
  extractNumbers: function (value) {
    return value.replace(/[^\d]+/g, '');
  },

  /**
   * Shorten a string to a given length if it is longr than that.
   *
   * @param  {String} value
   * @param  {Number} length
   * @return {String}
   */
  shortenToLength: function (value, length) {
    return value.substring(0, length);
  }
}

module.exports = nmPhoneUtils;
