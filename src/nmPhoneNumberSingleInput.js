'use strict';

/**
 * This directive can be used to validate an international phone number that is being typed in a single input text.
 *
 * the phone number is validated agains a regura expression that you can find in `nmPhoneUtils.isValidPhoneNumber` function
 */
angular
  .module('namshi.nmPhoneNumber')
  .directive('nmPhoneNumberSingleInput', function () {
    return {
      require: 'ngModel',
      link: function($scope, elem, attr, ngModel) {
        ngModel.$parsers.unshift(function(value) {
          var isValid = nmPhoneUtils.isValidPhoneNumber(value);
          ngModel.$setValidity('nmPhoneNumberSingleInput', isValid);
          return isValid ? value : undefined;
        });

        ngModel.$formatters.unshift(function(value) {
          ngModel.$setValidity('nmPhoneNumberSingleInput', nmPhoneUtils.isValidPhoneNumber(value));
          return value;
        });
      }
    }
  });
