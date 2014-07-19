describe('cdev-error-handler', function() {
    'use strict';

    beforeEach(module('cdevErrorHandling'));


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

});
