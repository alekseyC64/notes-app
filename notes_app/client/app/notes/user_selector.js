(function() {
  UserSelectorCtrl.$inject = ['userService'];
  function UserSelectorCtrl(userService) {
    var $ctrl = this;
    $ctrl.$onInit = function() {
      userService.list().then(function(data) {
        $ctrl.users = data.objects;
      });
    }
    $ctrl.update = function() {
      $ctrl.onUpdate({'selected': $ctrl.selected});
    }
  };
  angular.module('notes').component('userSelector', {
    'controller': UserSelectorCtrl,
    'templateUrl': 'templates/user_selector.tpl.html',
    'bindings': {
      'selected': '<',
      'onUpdate': '&'
    }
  })
})();
