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
        'component': 'notesList',
        'resolve': {
          'data': function(notesService) {
            return notesService.get();
          }
        }
      })
      $urlRouterProvider.otherwise("/");
    }
  ]);

  angular.module('notes').component('notesList', {
    'templateUrl': 'templates/notes.tpl.html',
    'controller': function NotesCtrl(notesService) {
    },
    'bindings': {
      'data': '<'
    }
  });

  angular.module('notes').factory('notesService', ['$http', function($http) {
    return {
      'get': function() {
        return new Promise(function(fulfill, reject) {
          $http({
            'method': 'get',
            'url': 'http://localhost:8000/api/v1/note/'
          }).then(function(response) {
            fulfill(response.data);
          }, function(response) {
            console.log(response.data.error_message);
          })
        });
      }
    }
  }]);

})();
