(function() {
  'use strict';
  RegisterCtrl.$inject = ['userService']
  function RegisterCtrl(userService) {
    var ctrl = this;
    ctrl.registrationState = {};
    ctrl.attemptRegistration = function(username, password, verify) {
      if (password !== verify) {
        ctrl.registrationState['message'] = 'Passwords do not match'
        ctrl.registrationState['visible'] = true;
        ctrl.registrationState['severity'] = 'warning';
        return;
      }
      userService.register(username, password).then(function(status) {
        ctrl.registrationState['visible'] = false;
        userService.login(username, password).then(function(status) {
          ctrl.close();
        }).catch(function(status) {
          ctrl.registrationState['message'] = 'Problem during login; try to log in later'
          ctrl.registrationState['severity'] = 'error';
          ctrl.registrationState['visible'] = true;
        })
      }).catch(function(status) {
        ctrl.registrationState['message'] = status.error;
        ctrl.registrationState['severity'] = 'error';
        ctrl.registrationState['visible'] = true;
      });
    };
  };

  angular.module('notes').component('registration', {
    'templateUrl': 'templates/registration.tpl.html',
    'controller': RegisterCtrl,
    'bindings': {
      'close': '&'
    }
  });
})();
