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
});

