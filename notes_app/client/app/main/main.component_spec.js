'use strict';

describe('Component: Main', function() {
  var $componentController, scope, mockUibModal, mockUserService, $q

  beforeEach(module('notes'))

  describe('Modal windows', function() {
    var ctrl

    beforeEach(module(function($provide) {
      $provide.factory('$uibModal', function() {
        return {
          'open': jasmine.createSpy('open')
        }
      })
    }))

    beforeEach(inject(function(_$componentController_, $rootScope, $uibModal) {
      $componentController = _$componentController_
      scope = $rootScope.$new(true)
      mockUibModal = $uibModal
      mockUserService = {}
      ctrl = $componentController('main', ['mockUibModal', 'mockUserService'])
    }))

    it('uses the uibModal service to open a login window', function() {
      ctrl.openLoginModal()
      expect(mockUibModal.open).toHaveBeenCalledWith({
        'component': 'login'
      })
    })

    it('uses the uibModal service to open a registration window', function() {
      ctrl.openRegistrationModal()
      expect(mockUibModal.open).toHaveBeenCalledWith({
        'component': 'registration'
      })
    })
  })

  describe('Login and logout', function() {
    var ctrl

    beforeEach(module(function($provide) {
      $provide.factory('userService', function() {
        return {
          'session': jasmine.createSpy('session').and.callFake(function() {
            return $q.when({
              'logged_in': true,
              'data': {
                'id': 1,
                'username': 'admin',
                'resource_uri': 'api/v1/user/1/'
              }
            })
          }),
          'logout': jasmine.createSpy('logout')
        }
      })
    }))

    beforeEach(inject(function(_$componentController_, $rootScope, userService, _$q_) {
      $q = _$q_
      $componentController = _$componentController_
      scope = $rootScope.$new(true)
      mockUibModal = {}
      mockUserService = userService
      ctrl = $componentController('main', ['mockUibModal', 'mockUserService'])
    }))

    it('gets user state from service on init and binds it to controller', function() {
      ctrl.$onInit()
      scope.$digest()
      expect(ctrl.user).toBeDefined()
      expect(ctrl.user.logged_in).toBe(true)
      expect(ctrl.user.data).toEqual({
        'id': 1,
        'username': 'admin',
        'resource_uri': 'api/v1/user/1/'
      })
    })

    it('calls the user service logout method to log out', function() {
      ctrl.logout()
      expect(mockUserService.logout).toHaveBeenCalled()
    })
  })

  describe('Template', function() {
    var element

    beforeEach(module('test.templates'))

    beforeEach(module(function($provide) {
      $provide.factory('userService', function() {
        return {
          'session': jasmine.createSpy('session').and.callFake(function() {
            return $q.when({
              'logged_in': true,
              'data': {
                'id': 1,
                'username': 'admin',
                'resource_uri': 'api/v1/user/1/'
              }
            })
          }),
          'logout': jasmine.createSpy('logout')
        }
      })
    }))

    beforeEach(inject(function($rootScope, $compile, _$q_) {
      $q = _$q_
      scope = $rootScope.$new(true)
      element = angular.element('<main></main>')
      element = $compile(element)(scope)
      scope.$digest()
    }))

    it('shows welcome message and logout button when user is logged in', function() {
      scope.$digest()
      expect(element.text()).not.toContain('Login')
      expect(element.text()).not.toContain('Register')
      expect(element.text()).toContain('Welcome')
      expect(element.text()).toContain('Logout')
    })

    it('shows login and register buttons when user is not logged in', function() {
      element.controller('main').user = undefined
      scope.$digest()
      expect(element.text()).toContain('Login')
      expect(element.text()).toContain('Register')
      expect(element.text()).not.toContain('Welcome')
      expect(element.text()).not.toContain('Logout')
    })
  })
})
