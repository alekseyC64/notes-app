(function() {
  'use strict';
  RegisterCtrl.$inject = ['userService']
  function RegisterCtrl(userService) {
    var ctrl = this;
    ctrl.registrationState = {};
    ctrl.attemptRegistration = function(username, password) {
      userService.register(username, password);
    };
  };

  angular.module('notes').component('registration', {
    'templateUrl': 'templates/registration.tpl.html',
    'controller': RegisterCtrl
  });
})();
