(function() {
  'use strict';

  angular.module('notes', [
    'ui.router',
    'ui.select',
    'ui.bootstrap',
    'ngSanitize'
  ]);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
      'name': 'note',
      'url': '/note',
      'abstract': true,
      'templateUrl': 'templates/notes.tpl.html'
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
