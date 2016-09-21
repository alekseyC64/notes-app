(function() {
  'use strict';

  userService.$inject = ['$http', '$log'];
  function userService($http, $log) {
    var api_path = 'http://localhost:8000/api/v1/user/';
    return {
      'list': function() {
        return $http.get(api_path).then(function successHandler(response) {
          return response.data;
        }).catch(function errorHandler(response) {
          $log.error('Problem with fetching data from server');
          return [];
        });
      }
    }
  };

  angular.module('notes').factory('userService', userService);
})();