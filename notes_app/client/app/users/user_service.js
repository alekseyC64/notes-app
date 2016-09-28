(function() {
  'use strict';

  userService.$inject = ['$http', '$log', '$q'];
  function userService($http, $log, $q) {
    var api_path = 'http://localhost:8000/api/v1/user/',
        user = {'logged_in': false};
    return {
      'user': user,
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
          return;
        }).catch(function(response) {
          return $q.reject({
            'error': response.data['error'] ? response.data['error'] : 'Server error'
          })
        });
      },
      'login': function(username, password) {
        var data = {'username': username, 'password': password};
        return $http.post(api_path+'login/', data).then(function(response) {
          user.logged_in = true;
          return;
        }).catch(function(response) {
          return $q.reject({
            'error': response.data['error'] ? response.data['error'] : 'Server error'
          });
        })
      },
      'logout': function() {
        return $http.post(api_path+'logout/').then(function(response) {
          user.logged_in = false;
          return;
        });
      }
    }
  };

  angular.module('notes').factory('userService', userService);
})();
