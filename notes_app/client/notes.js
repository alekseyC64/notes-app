(function() {
  'use strict';

  angular.module('notes', [
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'ngSanitize'
  ]);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
  function config($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $stateProvider.state({
      'name': 'note',
      'url': '/note',
      'abstract': true,
      'templateUrl': 'templates/notes.tpl.html',
      'controller': function($uibModal, userService) {
        var self = this;
        self.openLoginModal = function() {
          $uibModal.open({
            'component': 'login'
          })
        };
        self.logout = function() {
          userService.logout();
        };
      },
      'controllerAs': '$ctrl'
    }).state({
      'name': 'note.list',
      'url': '',
      'template': '<notes-list></notes-list>'
    }).state({
      'name': 'note.add',
      'url': '/add',
      'template': '<note-add-form></note-add-form>'
    });

    $urlRouterProvider.otherwise("/note");
  };

  angular.module('notes').config(config);
})();
