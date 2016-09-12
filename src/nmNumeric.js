'use strict';

/**
 * This directive prevents any character inputs other than numbers to be set in a text field
 * by instantiating and adding a 'numericValidator' on the modelCtrl
 *
 * usage:
 *
 * <input type="text" data-nm-numeric />
 *
 */
angular.module('namshi.nmPhoneNumber').directive('nmNumeric', function () {
  return {
    require:  'ngModel',
    priority: 500,
    link:     function (scope, element, attrs, modelCtrl) {
      /**
       * Updates the view on the current field to newValue
       * @param newValue
       */
      var updateView = function (newValue) {
        modelCtrl.$setViewValue(newValue);
        modelCtrl.$render();
      };

      /**
       * Parser to make sure that users are not allowed to enter characters other than numerics
       * in the field
       *
       * @param input
       * @returns {*}
       */
      var numericValidator = function (input) {
        var output;

        if (_.isString(input)) {
          output = input.replace(/[^0-9]/g, '');

          if (input !== output) {
            updateView(output);
          }
        }

        return output;
      };

      modelCtrl.$parsers.push(numericValidator);
    }
  };
});
