(function() {
  'use strict';

  notesService.$inject = ['$http'];

  function notesService($http) {
    var api_path = 'http://localhost:8000/api/v1/note/';
    return {
      'list': function() {
        return $http.get(api_path);
      },
      'read': function(id) {
        return $http.get(api_path + id + '/');
      },
      'create': function(note) {
        return $http.post(api_path, note);
      }
    }
  };

  angular.module('notes').factory('notesService', notesService);
})();
