(function() {
  'use strict';

  angular.module('notes', ['ui.router']);

  angular.module('notes').config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider.state({
        'name': 'notes',
        'url': '/',
        'template': '<notes-list notes="$resolve.notes"></notes-list>',
        'resolve': {
          notes: function(notesService) {
            return notesService.getList().then(function(response) {
              return response.data.objects;
            }).catch(function(response) {
              console.error('Error when loading notes');
            });
          }
        }
      })
      $urlRouterProvider.otherwise("/");
    }
  ]);
})();
