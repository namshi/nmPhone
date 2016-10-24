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
angular.module('namshi.nmPhoneNumber').directive('nmRangeLength', ['nmPhoneUtils', function (nmPhoneUtils) {
  return {
    restrict: 'A',
    require:  'ngModel',
    priority: 1000,
    scope:    {
      maxlength: '=',
      minlength: '='
    },
    link:     function (scope, elem, attr, ctrl) {
      var maxlength = parseInt(scope.maxlength, 10) || 15;
      var minlength = parseInt(scope.minlength, 10) || 1;

      var maxLengthValidator = nmPhoneUtils.getMaxLengthValidator(maxlength, function (isValid, value) {
        ctrl.$setValidity('maxlength', isValid);
        if (!(isValid || _.isEmpty(value))) {
          ctrl.$setViewValue(value);
          ctrl.$render();
        }

      });

      var minLengthValidator = nmPhoneUtils.getMinLengthValidator(minlength, function (isValid) {
        ctrl.$setValidity('minlength', isValid);
      });

      ctrl.$parsers.push(maxLengthValidator, minLengthValidator);
      ctrl.$formatters.push(maxLengthValidator, minLengthValidator);
    }
  };
}]);
