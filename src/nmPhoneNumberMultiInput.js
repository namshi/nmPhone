'use strict';

/**
 * This directive defines utilities to validate an international phone number based on 3 inputs:
 *
 * - country
 * - carrier
 * - number
 *
 * It will expose helper methods to run the validation on single fields and the three combined.
 *
 * You can specify which country are allowed and which validation to perform on each. (see `test/utilsTest.js`)
 *
 */
angular
  .module('namshi.nmPhoneNumber')
  .directive('nmPhoneNumberMultiInput', function () {
    return {
      scope: {
        phoneNumber: '=phoneNumber',
        phoneSettings: '=phoneSettings',
        loadingsSave: '=loadingsSave',
        save: '&'
      },
      controller: function ($scope) {
        function getProperty(property) {
          if($scope.phoneData.fkCountry){
            var phoneSettings = $scope.phoneSettings[$scope.phoneData.fkCountry.toLowerCase()].phoneCodes;
            return phoneSettings[property];
          }
        };

        function resetValidation() {
          $scope.phoneValidation = {
            countryCode: {valid: undefined},
            carrierCode: {valid: undefined},
            number: {valid: undefined}
          };
        }

        resetValidation();

        $scope.nmContains = nmPhoneUtils.contains;
        $scope.phoneData = nmPhoneUtils.parsePhone($scope.phoneNumber, $scope.phoneSettings);
        $scope.getProperty = getProperty;

        $scope.onContrySelected = function(options) {
          resetValidation();
          $scope.validateCountry();

          if (!$scope.isPhoneValid()) {
            return;
          }

          var cellTokens = $scope.phoneData.cellTokens;
          var fkCountry  = $scope.phoneData.fkCountry.toLowerCase();
          var phoneCodes = $scope.phoneSettings[fkCountry].phoneCodes;

          cellTokens.countryCode = phoneCodes.country;
          cellTokens.carrierCode = phoneCodes.carrierCodes[0] ? phoneCodes.carrierCodes[0].toString() : null;

          $scope.validateCarrierCode();
          !options.validateNumber ? null : $scope.validateNumber({trimNumber: false});
        };

        $scope.savePhone = function (phoneData) {
          $scope.save()(phoneData);
        };

        $scope.validateCountry = function() {
          $scope.phoneValidation.countryCode = nmPhoneUtils.validateCountry(
            $scope.phoneData.fkCountry,
            $scope.phoneSettings
          );
        }

        $scope.validateCarrierCode = function() {
          $scope.phoneValidation.carrierCode = nmPhoneUtils.validateCarrierCode(
            $scope.phoneData.cellTokens.carrierCode,
            $scope.phoneData.fkCountry,
            $scope.phoneSettings
          );
        }

        $scope.validateNumber = function(options) {
          options = options || {};

          $scope.phoneData.cellTokens.number = nmPhoneUtils.extractNumbers($scope.phoneData.cellTokens.number);

          /* when changing country code we should not touch the number, but only run the validation*/
          if (options.trimNumber !== false) {
            $scope.phoneData.cellTokens.number = nmPhoneUtils.shortenToLength(
              $scope.phoneData.cellTokens.number,
              getProperty('maxlength')
            );
          }

          $scope.phoneValidation.number = nmPhoneUtils.validateNumber(
            $scope.phoneData.cellTokens.number,
            getProperty('minlength'),
            getProperty('maxlength')
          );
        }

        $scope.isPhoneValid = function() {
          return (
            ($scope.phoneValidation.countryCode.valid === undefined || $scope.phoneValidation.countryCode.valid === true) &&
            ($scope.phoneValidation.carrierCode.valid === undefined || $scope.phoneValidation.carrierCode.valid === true) &&
            ($scope.phoneValidation.number.valid === undefined || $scope.phoneValidation.number.valid === true)
          );
        }
      },
      templateUrl: function(elem, attr){
        return attr.templateUrl;
      }
    };
  });
