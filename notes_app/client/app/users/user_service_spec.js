'use strict';

describe('Service: User', function() {
  var userService, httpBackend, $log

  var fixture_userdata = {
    'id': 1,
    'username': 'foobar',
    'resource_uri': 'api/v1/user/1/'
  }

  var fixture_meta = {
    'limit': 20,
    'next': null,
    'offset': 0,
    'previous': null,
    'total_count': 3
  }

  var fixture_users = [
    {
      'email': 'demo0@example.com',
      'first_name': 'Charles',
      'id': 1,
      'last_name': 'Jones',
      'resource_uri': '/api/v1/user/1/',
      'username': 'demo_user_00'
    },
    {
      'email': 'demo1@example.com',
      'first_name': 'Susan',
      'id': 2,
      'last_name': 'Wilson',
      'resource_uri': '/api/v1/user/2/',
      'username': 'demo_user_01'
    },
    {
      'email': 'demo2@example.com',
      'first_name': 'Linda',
      'id': 3,
      'last_name': 'Martinez',
      'resource_uri': '/api/v1/user/3/',
      'username': 'demo_user_02'
    }
  ]

  var fixture_response = {
    'meta': fixture_meta,
    'objects': fixture_users
  }

  beforeEach(module('notes'))
  beforeEach(module('test.templates'))
  beforeEach(inject(function(_userService_, $httpBackend, _$log_) {
    userService = _userService_
    httpBackend = $httpBackend
    $log = _$log_
  }))

  it("should bind user data", function() {
    expect(userService.user).toBeDefined()
  })

  describe("HTTP API tests", function() {
    afterEach(function() {
      httpBackend.flush()
      httpBackend.verifyNoOutstandingExpectation()
    })

    describe("List method", function() {
      it("should return the list of users on success", function() {
        httpBackend.expectGET(userService.api_path).respond(fixture_response)
        userService.list().then(function(result) {
          expect(result).toEqual(fixture_response)
        })
      })

      it("should return an empty list on failure and log a message", function() {
        httpBackend.expectGET(userService.api_path).respond(403, '')
        userService.list().then(function(result) {
          expect(result).toEqual([])
          expect($log.error.logs).toContain(['Problem with fetching data from server'])
        })
      })
    })

    describe("Update method", function() {
      it("should do a put request", function() {
        httpBackend.expectPUT(userService.api_path+'1/').respond('')
        userService.update(1, {})
      })

      it("should log response on error", function() {
        httpBackend.expectPUT(userService.api_path+'1/').respond(403, 'Not authorized')
        userService.update(1, {}).catch(function(result) {
          expect($log.error.logs).toContain(['Not authorized'])
        })
      })
    })

    describe("Update method", function() {
      it("should do a delete request", function() {
        httpBackend.expectDELETE(userService.api_path+'1/').respond('')
        userService.delete(1)
      })

      it("should log response on error", function() {
        httpBackend.expectDELETE(userService.api_path+'1/').respond(403, 'Not authorized')
        userService.delete(1).catch(function(result) {
          expect($log.error.logs).toContain(['Not authorized'])
        })
      })
    })

    describe("Register method", function() {
      it("should do a post request", function() {
        httpBackend.expectPOST(userService.api_path+'register/').respond('')
        userService.register('foo', 'bar')
      })

      it("should return an object with error message on fail", function() {
        httpBackend.expectPOST(userService.api_path+'register/').respond(400, {
          'error': 'Password is missing'
        })
        userService.register('foobar', 'foo').catch(function(result) {
          expect(result.error).toEqual('Password is missing')
        })
      })

      it("should return a generic error if no error data is received", function() {
        httpBackend.expectPOST(userService.api_path+'register/').respond(-1, '')
        userService.register('foobar', 'foo').catch(function(result) {
          expect(result.error).toEqual('Server error')
        })
      })
    })

    describe("Login method", function() {
      it("should set session data on successful login", function() {
        httpBackend.expectPOST(userService.api_path+'login/').respond(fixture_userdata)
        userService.login('foobar', 'foobar').then(function(result) {
          expect(userService.user.logged_in).toBe(true)
          expect(userService.user.data).toEqual(fixture_userdata)
        })
      })

      it("should return an object with error message on fail", function() {
        httpBackend.expectPOST(userService.api_path+'login/').respond(403, {
          'error': 'Username or password is incorrect'
        })
        userService.login('foobar', 'foo').catch(function(result) {
          expect(userService.user.logged_in).toBe(false)
          expect(result.error).toEqual('Username or password is incorrect')
        })
      })

      it("should return a generic error if no error data is received", function() {
        httpBackend.expectPOST(userService.api_path+'login/').respond(-1, '')
        userService.login('foobar', 'foo').catch(function(result) {
          expect(result.error).toEqual('Server error')
        })
      })
    })

    describe("Logout method", function() {
      it("should set login status to false on logout", function() {
        httpBackend.expectPOST(userService.api_path+'logout/').respond('')
        userService.logout().then(function(result) {
          expect(userService.user.logged_in).toBe(false)
        })
      })
    })

    describe("Session method", function() {
      it("should set session data on successful call", function() {
        httpBackend.expectGET(userService.api_path+'session/').respond(fixture_userdata)
        userService.session().then(function(result) {
          expect(userService.user.logged_in).toBe(true)
          expect(userService.user.data).toEqual(fixture_userdata)
        })
      })

      it("should clear session data on failed call", function() {
        httpBackend.expectGET(userService.api_path+'session/').respond(403, '')
        userService.session().then(function(result) {
          expect(userService.user.logged_in).toBe(false)
          expect(userService.user.data).toBeNull()
        })
      })
    })
  })
})
