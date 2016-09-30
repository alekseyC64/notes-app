(function() {
  'use strict';

  notesService.$inject = ['$http', '$log'];

  function notesService($http, $log) {
    var api_path = 'http://localhost:8000/api/v1/note/';
    var data = {
      notes: [],
      metadata: {}
    };
    function updateData(res){
      data.notes = res.objects;
      data.metadata = res.meta;
    }
    return {
      'data': data,
      'list': function(limit, offset) {
        return $http.get(api_path, {
          'params': {
            'limit': limit,
            'offset': offset
          }
        }).then(function successHandler(response) {
            updateData(response.data);
        }).catch(function errorHandler(response) {
          $log.error('Problem with getting the note list from server');
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
      'delete': function (id) {
        return $http.delete(api_path + id + '/').then(function (response) {
          for (var i = 0; i < data.notes.length; i++) {
            if (data.notes[i].id === id) {
              data.notes.splice(i,1);
            }
          }
        }).catch(function errorHandler(response) {
          $log.error('Problem with deleting the note');
          return null;
        });
      }
    }
  }

  angular.module('notes').factory('notesService', notesService);
})();
