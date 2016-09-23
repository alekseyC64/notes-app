(function() {
  'use strict';
  function RegisterCtrl() {
    var ctrl = this;
    ctrl.registrationState = {};
  };

  angular.module('notes').component('registration', {
    'templateUrl': 'templates/registration.tpl.html',
    'controller': RegisterCtrl
  });
})();
