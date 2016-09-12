# nmPhone

Angular directives and a separate module to validate international phone numbers.

## Install (bower)

If you want to use the directives as a bower component

```
bower install --save namshi/nmPhone
```

## Use it

If you need only the `nmPhoneUtils` library you can include `dist/utils.js`.


To use the directives you need to include `src/nmPhoneNumber.js` as the first file (it will register the module `namshi.nmPhoneNumber`), then, based on what you want to use, you will need to include:

* `dist/utils.js` + `src/nmPhoneUtils.js`: it will attach the `nmPhoneUtils` module as a service in your angular app
* `src/nmNumeric.js`: it's a directive that will make sure whatever you type will retain only numbers
* `src/nmRangeLength.js`: it's a directive that will make sure whatever you type will be between a min and max length
* `src/PhoneNumberSingleInput`: it's a directive that will make sure you are typing an international number (+<prefix>[-<carriere>]-<number>)
* `src/PhoneNumberMultiInput`: it's a directive that will give you some utilities to handle the validation of an international number given as 3 different inputs: country, carrier, number.


Remember to add the module name into the app definition

```
angular.module('my_App', [..., 'namshi.nmPhoneNumber', ...]);
```

## Install (npm)

```
npm install --save git://github.com/namshi/nmPhone.git#1.0.2
```

**Note**: the exported module is the `utils.js` module.

## Build dist files

```
npm install
```

```
npm run-script build-dist
```

## Test

```
npm test
```
