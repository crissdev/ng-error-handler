(function() {
    'use strict';

    angular.module('cdevErrorHandling', ['pascalprecht.translate', 'ui.bootstrap'])
        .constant('cdevDefaultErrorCode', 'generic')
        .constant('cdevDefaultErrorMessage', 'Something went wrong')
        .constant('cdevErrorEventName', 'app-error')
        .factory('cdevErrorHandler', ['$rootScope', '$q', '$translate', 'cdevDefaultErrorCode', 'cdevDefaultErrorMessage', 'cdevErrorEventName',
            function($rootScope, $q, $translate, defaultErrorCode, defaultErrorMessage, errorEventName) {
                var _customHandlers = {};

                function _getErrorCode(error) {
                    var errorCode;

                    if (error) {
                        if (error instanceof Error) {
                            errorCode = error.message;
                        }
                        else if (angular.isString(error)) {
                            errorCode = error;
                        }
                        else if (error.code) {
                            errorCode = error.code;
                        }
                    }
                    return errorCode || defaultErrorCode;
                }

                //
                // Always return a resolved promise
                //
                function formatError(error, params) {
                    var translationId = 'errors.' + _getErrorCode(error),
                        deferred = $q.defer();

                    $translate(translationId, params)
                        .then(function(translation) {
                            deferred.resolve(translation);
                        })
                        .catch(function() {
                            console.log('The translation ID ' + translationId + ' is not mapped');
                            deferred.resolve(defaultErrorMessage);
                        });

                    return deferred.promise;
                }

                function handleError(error) {
                    var errorCode = _getErrorCode(error),
                        customHandler = _customHandlers[errorCode];

                    if (customHandler && angular.isFunction(customHandler)) {
                        customHandler(error);

                        // A custom error handler should perform an action that no longer needs to notify the rootScope
                        // about the error (ie. redirect to login/maintenance/etc. page)
                        return;
                    }

                    formatError(error)
                        .then(function(errorMessage) {
                            $rootScope.$emit(errorEventName, errorMessage);
                        });
                }

                function setCustomHandler(errorCode, handler) {
                    if (errorCode && angular.isFunction(handler)) {
                        _customHandlers[errorCode] = handler;
                    }
                }


                return {
                    format: formatError,
                    handle: handleError,
                    setCustomHandler: setCustomHandler
                };
            }
        ])
        .directive('cdevErrorBox', ['$rootScope', 'cdevErrorEventName', function($rootScope, errorEventName) {
            return {
                restrict: 'A',
                template: '<alert ng-if=\"pageError\" type=\"danger\" close=\"clearPageError()\">{{pageError}}</alert>',
                controller: function($scope) {
                    $scope.pageError = '';

                    // Convenient method to clear the error
                    $scope.clearPageError = function() {
                        $scope.pageError = '';
                    };

                    // Convenient method to set the error
                    $scope.setPageError = function(errorMessage) {
                        $scope.pageError = errorMessage;
                    };
                },
                link: function(scope) {
                    $rootScope.$on(errorEventName, function(event, errorMessage) {
                        scope.setPageError(errorMessage);
                    });
                }
            };
        }]);
})();
