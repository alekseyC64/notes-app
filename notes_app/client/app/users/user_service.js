(function() {
  'use strict';

  userService.$inject = ['$http', '$log'];
  function userService($http, $log) {
    var api_path = 'http://localhost:8000/api/v1/user/';
    return {
      'list': function() {
        return new Promise(function(fulfill, reject) {
          $http.get(api_path).then(function(response) {
            fulfill(response.data);
          }).catch(function(response) {
            $log.error('Problem with fetching data from server');
            reject(response);
          });
        });
      }
    }
  };

  angular.module('notes').factory('userService', userService);
})();
