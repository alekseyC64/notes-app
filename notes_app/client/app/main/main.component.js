(function() {
  'use strict';

  MainCtrl.$inject = ['$uibModal', 'userService'];
  function MainCtrl($uibModal, userService) {
    var ctrl = this;
    ctrl.user = userService.user;
    ctrl.openLoginModal = function() {
      $uibModal.open({
        'component': 'login'
      });
    };
    ctrl.openRegistrationModal = function() {
      $uibModal.open({
        'component': 'registration'
      });
    };
    ctrl.logout = function() {
      userService.logout();
    };
  };

  angular.module('notes').component('main', {
    'templateUrl': 'templates/main.tpl.html',
    'controller': MainCtrl
  });
})();
