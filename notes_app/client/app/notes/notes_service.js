(function() {
  'use strict';

  notesService.$inject = ['$http', '$log'];

  function notesService($http, $log) {
    var api_path = 'http://localhost:8000/api/v1/note/';
    return {
      'list': function() {
        return $http.get(api_path).then(function successHandler(response) {
          return response.data;
        }).catch(function errorHandler(response) {
          $log.error('Problem with getting the note list from server')
          return [];
        });
      },
      'read': function(id) {
        return $http.get(api_path + id + '/').then(
          function successHandler(response) {
            return response.data;
          }
        ).catch(function errorHandler(response) {
          $log.error('Problem with getting the note from server');
          return null;
        });
      },
      'create': function(note) {
        return $http.post(api_path, note).then(
          function successHandler(response) {
            return response.data;
          }
        ).catch(function errorHandler(response) {
          $log.error('Problem with creating the note');
          return null;
        })
      }
    }
  };

  angular.module('notes').factory('notesService', notesService);
})();
