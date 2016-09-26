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
      },
      'register': function(username, password) {
        var data = {'username': username, 'password': password}
        return $http.post(api_path+'register/', data).then(function(response) {
          return response.data;
        }).catch(function(response) {
          return response.data;
        });
      },
      'login': function(username, password) {
        var data = {'username': username, 'password': password};
        return $http.post(api_path+'login/', data).then(function(response) {
          return response.data;
        }).catch(function(response) {
          return response.data;
        })
      },
      'logout': function() {
        return $http.post(api_path+'logout/').then(function(response) {
          return response.data;
        }).catch(function(response) {
          return response.data;
        })
      }
    }
  };

  angular.module('notes').factory('userService', userService);
})();
