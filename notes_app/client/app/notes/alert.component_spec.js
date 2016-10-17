'use strict';

describe('Component: Alert', function() {
  beforeEach(module('notes.alert'))

  describe('Bindings', function() {
    var element, scope, state

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new()
      scope.state = {}
      element = angular.element('<alert state="state"></alert>')
      element = $compile(element)(scope)
      scope.$apply()
    }))

    it('binds alert message', function() {
      scope.state = {'message': 'Hello world', 'visible': true}
      scope.$apply()
      var div = element.find('div')
      expect(div.text()).toBe('Hello world')
      scope.state.message = 'Hello*2'
      scope.$apply()
      expect(div.text()).toBe('Hello*2')
    })

    it('binds visibility status', function() {
      scope.state = {'message': 'Hello world', 'visible': false}
      scope.$apply()
      var div = element.find('div')
      expect(div.hasClass('ng-hide')).toBe(true)
      scope.state.visible = true
      scope.$apply()
      expect(div.hasClass('ng-hide')).toBe(false)
    })

    it('binds severity status', function() {
      scope.state = {'message': 'BIG BAD ERROR', 'visible': true,
        'severity': 'error'
      }
      scope.$apply()
      var div = element.find('div')
      expect(div.hasClass('alert-danger')).toBe(true)
    })
  })

  describe('Severity handling', function() {
    var $componentController

    beforeEach(inject(function(_$componentController_) {
      $componentController = _$componentController_
    }))

    it('defines getSeverity', function() {
      var bindings = {}
      var ctrl = $componentController('alert', null, bindings)
      expect(ctrl.getSeverity).toBeDefined()
    })

    it('returns correct Bootstrap classes', function() {
      var bindings = {'state': {'severity': 'error'}}
      var ctrl = $componentController('alert', null, bindings)
      expect(ctrl.getSeverity()).toEqual('alert-danger')
      ctrl.state.severity = 'info'
      expect(ctrl.getSeverity()).toEqual('alert-info')
      ctrl.state.severity = 'success'
      expect(ctrl.getSeverity()).toEqual('alert-success')
      ctrl.state.severity = 'warning'
      expect(ctrl.getSeverity()).toEqual('alert-warning')
    })

    it('produces alert-info for missing or incorrect values', function() {
      var ctrl = $componentController('alert', null, {'state': {}})
      expect(ctrl.getSeverity()).toEqual('alert-info')
      ctrl.state.severity = 'foobar'
      expect(ctrl.getSeverity()).toEqual('alert-info')
    })
  })
})
