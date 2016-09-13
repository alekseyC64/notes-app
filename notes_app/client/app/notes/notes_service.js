(function() {
  'use strict';

  notesService.$inject = ['$http'];

  function notesService($http) {
    return {
      'getList': function() {
        return $http.get('http://localhost:8000/api/v1/note/');
      }
    }
  };

  angular.module('notes').factory('notesService', notesService);
})();
