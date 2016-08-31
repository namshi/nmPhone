# nmPhone

Angular directives and a separate module to valid international phone numbers.

## Install (bower)

If you want to use the directives as a bower component

```
bower install --save namshi/nmPhone
```

## Use it

You will need to include 2 files into your app:

* `dist/utils.js`: it will load `nmPhoneUtils` module (use by the directives)
* `src/directive.js`: it will load `nmPhoneNumberSingleInput` and `nmPhoneNumber` directives

If you want to use the directives remember to add the module name into the app definition

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
