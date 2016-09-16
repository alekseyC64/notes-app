(function() {
  'use strict';

  notesService.$inject = ['$http', '$log'];

  function notesService($http, $log) {
    var api_path = 'http://localhost:8000/api/v1/note/';
    return {
      'list': function() {
        return new Promise(function(fulfill, reject) {
          $http.get(api_path).then(function(response) {
            fulfill(response.data);
          }).catch(function(response) {
            $log.error('Problem with fetching data from the server');
            reject(response);
          });
        });
      },
      'read': function(id) {
        return new Promise(function(fulfill, reject) {
          $http.get(api_path).then(function(response) {
            fulfill(response.data);
          }).catch(function(response) {
            $log.error('Problem with fetching data from the server');
            reject(response);
          })
        })
      },
      'create': function(note) {
        return new Promise(function(fulfill, reject) {
          $http.post(api_path, note).then(function(response) {
            fulfill(response.data);
          }).catch(function(response) {
            $log.error('Problem with creating the note');
            reject(response);
          })
        })
      }
    }
  };

  angular.module('notes').factory('notesService', notesService);
})();
