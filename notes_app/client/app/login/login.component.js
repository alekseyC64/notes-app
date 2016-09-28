(function() {
  'use strict';
  LoginCtrl.$inject = ['userService'];
  function LoginCtrl(userService) {
    var ctrl = this;
    ctrl.loginState = {};
    ctrl.attemptLogin = function(username, password) {
      userService.login(username, password).then(function(status) {
        ctrl.loginState['visible'] = false;
        ctrl.success();
      }).catch(function(status) {
        ctrl.loginState['visible'] = true;
        ctrl.loginState['message'] = status.error;
        ctrl.loginState['severity'] = 'error';
      });
    };
    ctrl.success = function() {
      ctrl.close({'$value': true});
    };
  };

  angular.module('notes').component('login', {
    'templateUrl': 'templates/login.tpl.html',
    'controller': LoginCtrl,
    'bindings': {
      'close': '&'
    }
  })
})();
