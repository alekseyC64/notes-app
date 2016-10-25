(function() {
  'use strict';

  userService.$inject = ['$http', '$log', '$q'];
  function userService($http, $log, $q) {
    var api_path = 'http://localhost:8000/api/v1/user/',
        user = {'logged_in': false, 'data': null};
    return {
      'user': user,
      'api_path': api_path,
      'list': function() {
        return $http.get(api_path).then(function successHandler(response) {
          return response.data;
        }).catch(function errorHandler(response) {
          $log.error('Problem with fetching data from server');
          return [];
        });
      },
      'update': function(id, data) {
        return $http.put(api_path + id + '/', data).then(function(response){
          return;
        }).catch(function(error){
          $log.error(error);
        });
      },
      'delete': function(id) {
        return $http.delete(api_path + id + '/').then(function(response){
          return;
        }).catch(function(error){
          $log.error(error);
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
          user.data = response.data;
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
      },
      'session': function() {
        return $http.get(api_path + 'session/').then(function(response) {
          user.logged_in = true;
          user.data = response.data;
          return user;
        }).catch(function(response) {
          user.logged_in = false;
          user.data = null;
          return user;
        })
      }
    }
  };

  angular.module('notes').factory('userService', userService);
})();
