(function() {
  'use strict';

  angular.module('notes', ['ui.router', 'ui.select', 'ngSanitize']);

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
      'template': '<notes-list notes="$resolve.notes"></notes-list>',
      'resolve': {
        notes: function(notesService) {
          return notesService.list();
        }
      }
    }).state({
      'name': 'note.add',
      'url': '/add',
      'template': '<note-add-form></note-add-form>'
    });

    $urlRouterProvider.otherwise("/note");
  };

  angular.module('notes').config(config);
})();
