describe('cdev-error-handler', function() {
    'use strict';

    beforeEach(module('cdevErrorHandling', function($translateProvider) {
        $translateProvider.translations('en', {
            errors: {
                timeout: 'Request timed out',
                invalid: '{{field}} is not valid'
            }
        });
        $translateProvider.preferredLanguage('en');
    }));


    //---------------------------------------------------------------------------------------------
    //- Tests for constants

    it('should define default error code', inject(function(cdevDefaultErrorCode) {
        expect(cdevDefaultErrorCode).toBe('generic');
    }));

    it('should define default error message', inject(function(cdevDefaultErrorMessage) {
        expect(cdevDefaultErrorMessage).toBe('Something went wrong');
    }));

    it('should define default event name', inject(function(cdevErrorEventName) {
        expect(cdevErrorEventName).toBe('app-error');
    }));


    //---------------------------------------------------------------------------------------------
    //- Tests for service

    it('should localize error message from {String} argument',
        inject(function($rootScope, cdevErrorHandler) {
            cdevErrorHandler.handle('timeout')
                .then(function(errorMessage) {
                    expect(errorMessage).toBe('Request timed out');
                });
            $rootScope.$digest();
        }));

    it('should localize error message from {Error} argument',
        inject(function($rootScope, cdevErrorHandler) {
            cdevErrorHandler.handle(new Error('timeout'))
                .then(function(errorMessage) {
                    expect(errorMessage).toBe('Request timed out');
                });
            $rootScope.$digest();
        }));

    it('should localize error message from {Object} argument',
        inject(function($rootScope, cdevErrorHandler) {
            cdevErrorHandler.handle({ code: 'timeout' })
                .then(function(errorMessage) {
                    expect(errorMessage).toBe('Request timed out');
                });
            $rootScope.$digest();
        }));

    it('should fallback to generic error message',
        inject(function($rootScope, cdevErrorHandler, cdevDefaultErrorMessage) {
            cdevErrorHandler.handle('not-mapped')
                .then(function(errorMessage) {
                    expect(errorMessage).toBe(cdevDefaultErrorMessage);
                });
            $rootScope.$digest();
        }));

    it('should return the default error message for default error code',
        inject(function($rootScope, cdevErrorHandler, cdevDefaultErrorCode, cdevDefaultErrorMessage) {
            cdevErrorHandler.handle(cdevDefaultErrorCode)
                .then(function(errorMessage) {
                    expect(errorMessage).toBe(cdevDefaultErrorMessage);
                });
            $rootScope.$digest();
        }));

    it('should call the custom error handler',
        inject(function($rootScope, cdevErrorHandler, cdevDefaultErrorMessage) {
            var handler = jasmine.createSpy('handler');

            cdevErrorHandler.setCustomHandler('custom', handler);

            cdevErrorHandler.handle('custom')
                .then(function(errorMessage) {
                    expect(errorMessage).toBe(cdevDefaultErrorMessage);
                    expect(handler).toHaveBeenCalledWith('custom');
                });
            $rootScope.$digest();
        }));

    it('should localize error message with interpolated arguments',
        inject(function($rootScope, cdevErrorHandler) {
            cdevErrorHandler.handle('invalid', { field: 'Email' })
                .then(function(errorMessage) {
                    expect(errorMessage).toBe('Email is not valid');
                });
            $rootScope.$digest();
        }));

    it('should localize error message without interpolated arguments',
        inject(function($rootScope, cdevErrorHandler) {
            cdevErrorHandler.handle('invalid')
                .then(function(errorMessage) {
                    expect(errorMessage).toBe(' is not valid');
                });
            $rootScope.$digest();
        }));

    it('should emit error event on $rootScope', inject(function(cdevErrorHandler, cdevErrorEventName, $rootScope) {
        var _errorEventName, _errorMessage, _errorCode;

        $rootScope.$on(cdevErrorEventName, function(event, errorMessage, errorCode) {
            _errorEventName = event.name;
            _errorMessage = errorMessage;
            _errorCode = errorCode;
        });
        cdevErrorHandler.handle(new Error('timeout'));
        $rootScope.$digest();

        expect(_errorEventName).toBe(cdevErrorEventName);
        expect(_errorMessage).toBe('Request timed out');
        expect(_errorCode).toBe('timeout');
    }));

    //---------------------------------------------------------------------------------------------
    //- Tests for directive

    it('should render the error box', inject(function(cdevErrorHandler, $rootScope, $compile) {
        var element = angular.element('<div cdev-error-box></div>');
        var scope = $rootScope.$new();

        $compile(element)(scope);
        scope.$digest();

        // Check if initialized correctly
        expect(scope.pageError).toBe('');
        expect(typeof scope.clearPageError).toBe('function');
        expect(typeof scope.setPageError).toBe('function');
        expect(element.find('span').length).toBe(0);

        // Manually set an error message
        scope.setPageError('an error message');
        scope.$digest();
        expect(scope.pageError).toBe('an error message');

        // Test if the error is handled and localized
        cdevErrorHandler.handle(new Error('timeout'));
        scope.$digest();
        expect(scope.pageError).toBe('Request timed out');
        expect(element.find('span').eq(2).text()).toBe('Request timed out');

        // Clear the error
        scope.clearPageError();
        scope.$digest();
        expect(scope.pageError).toBe('');
        expect(element.find('span').length).toBe(0);
    }));

});
