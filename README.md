# ng-error-handler

A localized error handler for AngularJS

[![Build Status](https://travis-ci.org/crissdev/ng-error-handler.svg?branch=master)](https://travis-ci.org/crissdev/ng-error-handler)
[![devDependency Status](https://david-dm.org/crissdev/ng-error-handler/dev-status.svg)](https://david-dm.org/crissdev/ng-error-handler#info=devDependencies)


### Dependencies

* [angular](https://angularjs.org/) of course
* [angular translate](http://angular-translate.github.io/) for localization support
* [ui bootstrap](http://angular-ui.github.io/bootstrap/) for making the error box look nice


### Demo

An example of how to use the cdevErrorBox directive on the page is available in [this](http://jsfiddle.net/crissdev/9UqM9/) fiddle.


### Installation

```sh
$ bower install ng-error-handler
```


### Documentation

##### cdevDefaultErrorCode

> Constant in cdevErrorHandling module

Defines the fallback error code to use.

##### cdevDefaultErrorMessage

> Constant in cdevErrorHandling module

Defines the fallback error message to use.

##### cdevErrorEventName

> Constant in cdevErrorHandling module

Defines the event name to use when notifying through $rootScope.

##### cdevErrorHandler

> Service in cdevErrorHandling module

Provides methods to handle and format errors.
The format method will attempt to retrieve a localized error message through $translate service.
The service also provides a way to define custom error handlers - case in which the error event
will no longer be triggered through $rootScope.$emit method.

##### cdevErrorBox

> Directive in cdevErrorHandling module

Provides a way to display the error received through $rootScope (using cdevErrorEventName), or
manually using the methods injected in the current scope.


### License

MIT © [Cristian Trifan](http://crissdev.com)
