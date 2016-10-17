'use strict';

describe('Component: Login', function() {
  var element, scope, state

  beforeEach(module('notes'))

  describe('Login function', function() {
    var $q, $componentController, mockUserService

    beforeEach(module(function($provide) {
      $provide.factory('userService', function() {
        return {
          'login': jasmine.createSpy('login').and.callFake(
            function(username, password) {
              return $q(function(fulfill, reject) {
                if ((username === 'foo') && (password === 'bar')) {
                  fulfill()
                } else {
                  reject({'error': 'Wrong username or password'})
                }
              })
            })
        }
      })
    }))

    beforeEach(inject(function(_$componentController_, $rootScope, userService, _$q_) {
      $componentController = _$componentController_
      $q = _$q_
      mockUserService = userService
      scope = $rootScope.$new(true)
    }))

    it('defines attemptLogin', function() {
      var ctrl = $componentController('login', ['mockUserService'])
      expect(ctrl.attemptLogin).toBeDefined()
    })

    it('uses userService to login and calls callbacks on success', function() {
      var ctrl = $componentController('login', ['mockUserService'])
      ctrl.success = spyOn(ctrl, 'success').and.callThrough()
      ctrl.close = jasmine.createSpy('close')
      ctrl.attemptLogin('foo', 'bar')
      scope.$digest()
      expect(mockUserService.login).toHaveBeenCalled()
      expect(ctrl.success).toHaveBeenCalled()
      expect(ctrl.close).toHaveBeenCalled()
      expect(ctrl.loginState.visible).toBe(false)
    })

    it('sets loginState values on login error', function() {
      var ctrl = $componentController('login', ['mockUserService'])
      ctrl.attemptLogin('foo', 'baz')
      scope.$digest()
      expect(mockUserService.login).toHaveBeenCalled()
      expect(ctrl.loginState.visible).toBe(true)
      expect(ctrl.loginState.severity).toBe('error')
      expect(ctrl.loginState.message).toBe('Wrong username or password')
    })
  })

  describe('Validation', function() {
    var inputs, username, password, button

    beforeEach(module('test.templates'))
    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new(true)
      scope.state = {}
      element = angular.element('<login></login>')
      element = $compile(element)(scope)
      scope.$apply()

      inputs = element.find('input')
      username = inputs[0]
      password = inputs[1]
      button = element.find('button')
    }))

    it('disables submit button when login and/or password is empty', function() {
      expect(button.prop('disabled')).toBe(true)
      username.value = 'JohnDoe'
      password.value = '123'
      inputs.triggerHandler('input')
      expect(button.prop('disabled')).toBe(false)
      username.value = ''
      inputs.triggerHandler('input')
      expect(button.prop('disabled')).toBe(true)
      username.value = 'JohnDoe'
      password.value = ''
      inputs.triggerHandler('input')
      expect(button.prop('disabled')).toBe(true)
    })
  })
})
