var nmPhoneUtils =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(1);

	/**
	 * Uses abstract comparison (==) NOT strict comparison (===)
	 */
	function contains(list, item) {
	  return _(list).map(function(litem) {return litem.toString()}).includes(item.toString());
	};

	/**
	 * Extracts only the numeric characters from a string.
	 *
	 * @param  {String} value
	 * @return {String}
	 */
	function extractNumbers(value) {
	  return value ? value.replace(/[^0-9]+/g, '') : '';
	};

	/**
	 * Shorten a string to a given length if it is longr than that.
	 *
	 * @param  {String} value
	 * @param  {Number} length
	 * @return {String}
	 */
	function shortenToLength(value, length) {
	  return value.substring(0, length);
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
	   * load country codes (971, 973, etc.) from config
	   *
	   * @param  {Object} phoneSettings
	   * @return {Array}
	   */
	  loadCountryCodes: function loadCountryCodes(phoneSettings) {
	    return _.map(phoneSettings, function (item) {
	      return item.phoneCodes.country;
	    });
	  },

	  /**
	   * Get country specific `phoneSetting` object
	   *
	   * @param  {Object} phoneSettings
	   * @param  {string|integer} countryCode
	   * @return {Object}
	   */
	  getCountryPhoneSettings: function getCountryPhoneSettings(phoneSettings, countryCode) {
	      var phoneSetting = _(phoneSettings).filter(function(item) {
	          return ''+item.phoneCodes.country === ''+countryCode;
	        }).value().shift();

	      return phoneSetting && phoneSetting.phoneCodes;
	  },


	  /**
	   * Will verfy that a given value is in a phone number format.
	   * The format is defined by a regex (see phoneRegex variable)
	   *
	   * @param  {Mixed} value
	   * @return {Boolean}
	   */
	  isValidPhoneNumber: function isValidPhoneNumber(value) {
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
	  parsePhone: function parsePhone(phone, phoneSettings, defaultCountry) {
	    var eo = _.clone(emptyPhoneObject);

	    if (!phone || !phoneRegex.test(phone)) {
	      eo.fkCountry = defaultCountry || '';
	      eo.cellTokens.countryCode = phoneSettings[defaultCountry] ? phoneSettings[defaultCountry].phoneCodes.country : '';

	      return eo;
	    }

	    var matches = phone.match(phoneRegex);
	    var countryCode = matches[1];
	    var phoneCountryConfig = _.find(phoneSettings, function(setting) {
	      return setting.phoneCodes.country == countryCode;
	    });

	    if (!phoneCountryConfig) {
	      eo.fkCountry = defaultCountry || '';
	      eo.cellTokens.countryCode = phoneSettings[defaultCountry] ? phoneSettings[defaultCountry].phoneCodes.country : '';

	      return eo;
	    }

	    var carrierCode = matches[3] || '';
	    var number = matches[4];

	    return {
	      fkCountry: ''+phoneCountryConfig.iso2Code,
	      cellTokens: {
	        countryCode: !!countryCode ? Number(countryCode) : "",
	        carrierCode: !!carrierCode ? Number(carrierCode) : "",
	        number: ''+number
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
	  validateCountry: function validateCountry(countryId, phoneSettings) {
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
	  validateCarrierCode: function validateCarrierCode(carrierCode, countryId, phoneSettings) {
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
	  validateNumber: function validateNumber(number, min, max) {
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
	  extractNumbers: extractNumbers,

	  /**
	   * Shorten a string to a given length if it is longr than that.
	   *
	   * @param  {String} value
	   * @param  {Number} length
	   * @return {String}
	   */
	  shortenToLength: shortenToLength,

	  /**
	   * Format the phoneData object into a string of the form:
	   *
	   * +<countrycode>-[<carriercode>-]<number>
	   *
	   * @param  {Object} phoneData
	   * @return {String}
	   */
	  getFormattedNumber: function getFormattedNumber(phoneData) {
	    if (!phoneData.cellTokens) {
	      return '';
	    }

	    return [
	        (!!phoneData.cellTokens.countryCode ? '+' + phoneData.cellTokens.countryCode : ''),
	        (''+phoneData.cellTokens.carrierCode),
	        (''+phoneData.cellTokens.number),
	      ].filter(function(v) { return !_.isEmpty(v); }).join('-');
	  },

	  isPhoneDataValid: function isPhoneDataValid(phoneData, phoneSettings, min, max) {
	    return (
	      !!phoneData.fkCountry &&
	      this.validateCountry(phoneData.fkCountry, phoneSettings).valid &&
	      this.validateCarrierCode(phoneData.cellTokens.carrierCode, phoneData.fkCountry, phoneSettings).valid &&
	      !!phoneData.cellTokens.number &&
	      this.validateNumber(phoneData.cellTokens.number, min, max).valid
	    );
	  },

	  /**
	   * Return the numeric validator function.
	   * The numericValidator function will filter out non numeric characters from the given input and call the callback.
	   * The callback is invoked only if one or more characters are removed from the input string
	   *
	   * @param callback
	   * @returns {*}
	   */
	  getNumericValidator: function getNumericValidator(callback) {
	    return function numericValidator(input) {
	      var output;

	      if (_.isString(input)) {
	        output = extractNumbers(input);

	        if (input !== output) {
	          callback(output);
	        }
	      }

	      return output;
	    };
	  },

	  /**
	   * Parser and formatter to invalidate a field which its value length exceeded the maximum number of
	   * allowed characters
	   *
	   * @param value
	   * @returns {*}
	   */
	  getMaxLengthValidator: function getMaxLengthValidator(callback, maxlength) {
	    return function maxLengthValidator(value) {
	      var isValid = _.isEmpty(value) || value.length <= maxlength;
	      if (!(isValid || _.isEmpty(value))) {
	        value = value.substring(0, maxlength);
	      }

	      callback(isValid, value);

	      return value;
	    }
	  },

	  /**
	   * Parser and Formatter to invalidate a field which its value length goes below the minimum number of
	   * allowed characters
	   *
	   * @param value
	   * @returns {*}
	   */
	  getMinLengthValidator: function getMinLengthValidator(callback, minlength) {
	    return function minLengthValidator(value) {
	      var isValid = _.isEmpty(value) || value.length >= minlength;
	      callback(isValid, value);

	      return value;
	    }
	  }
	}

	module.exports = nmPhoneUtils;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = _;

/***/ }
/******/ ]);