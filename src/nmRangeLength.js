'use strict';

/**
 * This directive validates min and max length of characters to be set on a field by instantiating and adding a
 * minLengthValidator and maxLengthValidator on the ctrl
 *
 * It marks the field as ng-invalid-maxlength if more than 'maxlength' characters have been set
 * or ng-invalid-minlength if less than 'minlength' characters are set.
 *
 * It also prevents user from entering more than 'maxLength' number of characters on the field
 *
 * usage:
 *
 * <input name="myField" type="text" data-nm-range-length minLength="2" maxLength="5" />
 *
 * `minLength`              the minimum number of characters that 'myField' should accept
 *                          (marks 'myField' as ng-invalid-minlength if less number of characters is set)
 *
 * `maxLength`              the maximum characters that the 'myField' should accept
 *                          (marks 'myField' as ng-invalid-maxlength if more number of characters is set)
 *
 * Note: html5 compatible browsers will automatically take care of not allowing a field to exceed the maximum number
 * of characters. This functionality is also implemented in this directive for non-HTML5 browsers
 *
 */
angular.module('namshi.nmPhoneNumber').directive('nmRangeLength', function () {
  return {
    restrict: 'A',
    require:  'ngModel',
    priority: 1000,
    scope:    {
      maxlength: '=',
      minlength: '='
    },
    link:     function (scope, elem, attr, ctrl) {
      /**
       * Parser and formatter to invalidate a field which its value length exceeded the maximum number of
       * allowed characters
       *
       * @param value
       * @returns {*}
       */
      var maxLengthValidator = function (value) {
        var maxlength = parseInt(scope.maxlength, 10) || 15;
        var isValid = ctrl.$isEmpty(value) || value.length <= maxlength;
        ctrl.$setValidity('maxlength', isValid);

        if (!(isValid || ctrl.$isEmpty(value))) {
          value = value.substring(0, maxlength);
          ctrl.$setViewValue(value);
          ctrl.$render();
        }

        return value;
      };

      /**
       * Parser and Formatter to invalidate a field which its value length goes below the minimum number of
       * allowed characters
       *
       * @param value
       * @returns {*}
       */
      var minLengthValidator = function (value) {
        var minlength = parseInt(scope.minlength, 10) || 1;
        var isValid = ctrl.$isEmpty(value) || value.length >= minlength;
        ctrl.$setValidity('minlength', isValid);

        return value;
      };

      ctrl.$parsers.push(maxLengthValidator);
      ctrl.$parsers.push(minLengthValidator);
      ctrl.$formatters.push(maxLengthValidator);
      ctrl.$formatters.push(minLengthValidator);
    }
  };
});
