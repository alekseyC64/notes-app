(function() {
  'use strict';
  RegisterCtrl.$inject = ['userService']
  function RegisterCtrl(userService) {
    var ctrl = this;
    ctrl.registrationState = {};
    ctrl.attemptRegistration = function(username, password) {
      userService.register(username, password).then(function(status) {
        ctrl.registrationState['visible'] = false;
        userService.login(username, password).then(function(status) {
          ctrl.close({'$value': true});
        }).catch(function(status) {
          ctrl.registrationState['message'] = 'Problem logging in; try to log in manually'
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
