(function() {
  'use strict';

  angular.module('notes.alert', []).component('alert', {
    'template': '<div class="alert" ng-show="$ctrl.state.visible" \
    ng-bind="$ctrl.state.message" ng-class="$ctrl.getSeverity()"></div>',
    'controller': function() {
      var self = this;
      this.getSeverity = function() {
        switch (self.state.severity) {
          case 'success':
            return 'alert-success'
          case 'error':
            return 'alert-danger'
          case 'warning':
            return 'alert-warning'
          default:
            return 'alert-info'
        }
      }
    },
    'bindings': {
      'state': '<'
    }
  });
})();
