(function() {
  'use strict';

  angular.module('notes.services', []);
  angular.module('notes', [
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.pagination',
    'ui.grid.selection',
    'ngSanitize',
    'templates',
    'notes.services',
    'notes.alert',
  ]);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
  function config($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $stateProvider.state({
      'name': 'main',
      'url': '/',
      'template': '<main></main>',
      'abstract': true,
      'resolve': {
        user: function(userService) {
          return userService.session();
        }
      }
    }).state({
      'name': 'main.welcome',
      'url': 'welcome',
      'templateUrl': 'templates/welcome.tpl.html',
      'onEnter': function($state, user) {
        if (user.logged_in) {
          $state.go('main.note.list');
        }
      }
    }).state({
      'name': 'main.users',
      'url': 'users',
      'template': '<users-list></users-list>',
      'data': {
        'loginRequired': true
      },
      'onEnter': function($state, user) {
        if (!user.data.is_superuser || !user.logged_in) {
          $state.go('main.note.list');
        }
      }
    }).state({
      'name': 'main.note',
      'url': 'note',
      'templateUrl': 'templates/notes.tpl.html',
      'abstract': true,
      'data': {
        'loginRequired': true,
      },
        'onEnter': function($state, user) {
          if (!user.logged_in) {
            $state.go('main.welcome');
          }
        }
    }).state({
      'name': 'main.note.list',
      'url': '',
      'template': '<notes-list></notes-list>'
    }).state({
      'name': 'main.note.listview',
      'url': '/listview',
      'template': '<notes-list-list></notes-list-list>'
    }).state({
      'name': 'main.note.add',
      'url': '/add',
      'template': '<note-add-form></note-add-form>'
    });

    $urlRouterProvider.otherwise("/note");
  };

  angular.module('notes').config(config);
})();
