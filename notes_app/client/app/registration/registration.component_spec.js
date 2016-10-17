'use strict';

describe('Component: Registration', function() {
  beforeEach(module('notes'))

  describe('Registration logic', function() {
    var $componentController, $q, scope, mockUserService

    beforeEach(module(function($provide) {
      $provide.factory('userService', function() {
        return {
          'login': jasmine.createSpy('login').and.callFake(function(u, p) {
            return $q(function(fulfill, reject) {
              if ((u === 'foo') && (p === 'bar')) {
                fulfill()
              } else {
                reject()
              }
            })
          }),
          'register': jasmine.createSpy('register').and.callFake(function(u, p) {
            return $q(function(fulfill, reject) {
              if (u === 'bar') {
                reject({'error': 'User already exists'})
              }
              fulfill()
            })
          })
        }
      })
    }))

    beforeEach(inject(function(_$componentController_, $rootScope, _$q_, userService) {
      $componentController = _$componentController_
      scope = $rootScope.$new(true)
      $q = _$q_
      mockUserService = userService
    }))

    it('sets error state if password and verify values don\'t match', function() {
      var ctrl = $componentController('registration', ['mockUserService'])
      ctrl.attemptRegistration('', 'aaa', 'aab');
      expect(mockUserService.register).not.toHaveBeenCalled()
      expect(ctrl.registrationState.visible).toBe(true)
      expect(ctrl.registrationState.message).toEqual('Passwords do not match')
      expect(ctrl.registrationState.severity).toEqual('warning')
    })

    it('also logins if authentication is successful', function() {
      var ctrl = $componentController('registration', ['mockUserService'])
      ctrl.close = jasmine.createSpy('close')
      ctrl.attemptRegistration('foo', 'bar', 'bar')
      scope.$digest()
      expect(mockUserService.register).toHaveBeenCalled()
      expect(mockUserService.login).toHaveBeenCalled()
      expect(ctrl.close).toHaveBeenCalled()
      expect(ctrl.registrationState.visible).toBe(false)
    })

    it('sets error state if registration is successful, but login isn\'t', function() {
      var ctrl = $componentController('registration', ['mockUserService'])
      ctrl.attemptRegistration('foo', 'bad_pass', 'bad_pass')
      scope.$digest()
      expect(ctrl.registrationState.visible).toBe(true)
      expect(ctrl.registrationState.severity).toEqual('error')
      expect(ctrl.registrationState.message).toEqual('Problem during login; try to log in later')
    })

    it('sets error state if registration failed', function() {
      var ctrl = $componentController('registration', ['mockUserService'])
      ctrl.attemptRegistration('bar', 'bad_pass', 'bad_pass')
      scope.$digest()
      expect(ctrl.registrationState.visible).toBe(true)
      expect(ctrl.registrationState.severity).toEqual('error')
      expect(ctrl.registrationState.message).toEqual('User already exists')
    })
  })
})
