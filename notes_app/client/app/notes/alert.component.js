(function() {
  'use strict';

  angular.module('notes').component('alert', {
    'template': '<div class="alert" ng-show="$ctrl.message" ng-bind="$ctrl.message" ng-class="$ctrl.getClass()"></div>',
    'controller': function() {
      var self = this;
      this.class = 'info';
      this.message = '';
      this.getClass = function() {
        switch (self.message) {
          case 'success':
            return 'alert-success'
          case 'error':
            return 'alert-error'
          case 'warning':
            return 'alert-warning'
          default:
            return 'alert-info'
        }
      }
    },
    'bindings': {
      'message': '<',
      'class': '<'
    }
  });
})();
