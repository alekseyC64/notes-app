'use strict';

describe('Component: User Selector', function() {
  var $componentController, $compile, scope, $q, mockUserService, ctrl

  var fixture_users = [
    {id: 1, username: 'admin', first_name: 'Admin', last_name: 'Admin'},
    {id: 2, username: 'foobar', first_name: 'foo', last_name: 'bar'},
    {id: 3, username: 'jdoe', first_name: 'John', last_name: 'Doe'}
  ]

  beforeEach(module('notes'))
  beforeEach(module('test.templates'))
  beforeEach(module(function($provide) {
    $provide.factory('userService', function() {
      return {
        'list': function() {
          return $q.when({'objects': fixture_users})
        }
      }
    })
  }))

  beforeEach(inject(function(_$componentController_, $rootScope, _$compile_, _$q_, userService) {
    $componentController = _$componentController_
    scope = $rootScope.$new(true)
    $compile = _$compile_
    $q = _$q_
    mockUserService = userService
    ctrl = $componentController('userSelector', ['mockUserService'])
  }))

  it("fetches users from the user service on init", function() {
    ctrl.$onInit()
    scope.$digest()
    expect(ctrl.users).toEqual(fixture_users)
  })

  it("calls onUpdate classback with selected users as argument on update", function() {
    ctrl.onUpdate = jasmine.createSpy('onUpdate')
    ctrl.selected = []
    ctrl.update()
    expect(ctrl.onUpdate).toHaveBeenCalledWith({
      'selected': []
    })
    ctrl.selected = [fixture_users[0], fixture_users[2]]
    ctrl.update()
    expect(ctrl.onUpdate).toHaveBeenCalledWith({
      'selected': ctrl.selected
    })
  })

  it("accepts selected users as component parameter", function() {
    scope.external_users = fixture_users.slice(0, 2)
    var element = angular.element('<user-selector selected="external_users"></user-selector>')
    element = $compile(element)(scope)
    scope.$digest()
    var controller = element.controller('userSelector')
    expect(controller.selected).toEqual(fixture_users.slice(0, 2))
  })
})
