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
    $httpProvider.defaults.allowCredentials = true;

    $stateProvider.state({
      'name': 'main',
      'url': '/',
      'template': '<main></main>',
      'abstract': true
    }).state({
      'name': 'main.welcome',
      'url': 'welcome',
      'templateUrl': 'templates/welcome.tpl.html'
    }).state({
      'name': 'main.note',
      'url': 'note',
      'templateUrl': 'templates/notes.tpl.html',
      'abstract': true,
      'data': {
        'loginRequired': true,
      }
    }).state({
      'name': 'main.note.list',
      'url': '',
      'template': '<notes-list></notes-list>'
    }).state({
      'name': 'main.note.add',
      'url': '/add',
      'template': '<note-add-form></note-add-form>'
    });

    $urlRouterProvider.otherwise("/note");
  };

  angular.module('notes').config(config);

  angular.module('notes').run(function($rootScope, $state, userService) {
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options) {
        if (toState.data && toState.data['loginRequired']) {
          if (!userService.user.logged_in) {
            event.preventDefault();
            $state.go('main.welcome');
          }
        }
      }
  );
  })
})();
