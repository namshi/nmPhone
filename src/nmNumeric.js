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
angular.module('namshi.nmPhoneNumber').directive('nmNumeric', function (nmPhoneUtils) {
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

      modelCtrl.$parsers.push(nmPhoneUtils.getNumericValidator(updateView));
    }
  };
});
