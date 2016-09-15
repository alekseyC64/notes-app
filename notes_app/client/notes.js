(function() {
  'use strict';

  angular.module('notes', ['ui.router']);

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
          return notesService.list().then(function(response) {
            return response.data.objects;
          }).catch(function(response) {
            console.error('Error when loading notes');
          });
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
