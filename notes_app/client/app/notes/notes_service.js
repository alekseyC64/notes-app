(function() {
  'use strict';

  notesService.$inject = ['$http', '$log'];

  function notesService($http, $log) {
    var api_path = 'http://localhost:8000/api/v1/note/';
    return {
      'list': function(limit, offset) {
        return $http.get(api_path, {
          'params': {
            'limit': limit,
            'offset': offset
          }
        }).then(function successHandler(response) {
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
            return true;
          }
        ).catch(function errorHandler(response) {
          $log.error('Problem with creating the note');
          return false;
        })
      },
      'pagenumToOffset': function(pagenum, limit) {
        return (pagenum - 1) * limit;
      }
    }
  };

  angular.module('notes').factory('notesService', notesService);
})();
