'use strict';

describe('Service: User', function() {
  var userService, httpBackend, log

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
    },
  ]

  var fixture_response = {
    'meta': fixture_meta,
    'objects': fixture_users
  }

  beforeEach(module('notes'))
  beforeEach(inject(function(_userService_, $httpBackend, $log) {
    userService = _userService_
    httpBackend = $httpBackend
    log = $log
  }))

  it("should bind user data", function() {
    expect(userService.user).toBeDefined()
  })

  describe("List method", function() {
    it("should return the list of users on success", function() {
      httpBackend.whenGET(userService.api_path).respond(fixture_response)
      userService.list().then(function(result) {
        expect(result).toEqual(fixture_users)
      })
    })
    it("should return an empty list on failure and log a message", function() {
      httpBackend.whenGET(userService.api_path).respond(403, '')
      userService.list().then(function(result) {
        expect(result).toEqual([])
        expect(log.errors).toContain('Problem with fetching data from server')
      })
    })
  })

  describe("Register method", function() {
    it("should do a post request", function() {
      httpBackend.expectPOST(userService.api_path+'register/').respond('')
      userService.register('foo', 'bar').then(function(result) {
        httpBackend.verifyNoOutstandingExpectation()
      })
    })

    it("should return an object with error message on fail", function() {
      httpBackend.whenPOST(userService.api_path+'register/').respond(400, {
        'error': 'Password is missing'
      })
      userService.login('foobar', 'foo').catch(function(result) {
        expect(result.error).toEqual('Password is missing')
      })
    })
  })

  describe("Login method", function() {
    it("should set session data on successful login", function() {
      httpBackend.whenPOST(userService.api_path+'login/').respond(fixture_userdata)
      userService.login('foobar', 'foobar').then(function(result) {
        expect(userService.user.logged_in).toBeTrue()
        expect(userService.user.data).toEqual(fixture_userdata)
      })
    })

    it("should return an object with error message on fail", function() {
      httpBackend.whenPOST(userService.api_path+'login/').respond(403, {
        'error': 'Username or password is incorrect'
      })
      userService.login('foobar', 'foo').catch(function(result) {
        expect(userService.user.logged_in).toBeFalse()
        expect(result.error).toEqual('Username or password is incorrect')
      })
    })
  })

  describe("Logout method", function() {
    it("should set login status to false on logout", function() {
      httpBackend.whenPOST(userService.api_path+'logout/').respond('')
      userService.logout().then(function(result) {
        expect(userService.user.logged_in).toBeFalse()
      })
    })
  })

  describe("Session method", function() {
    it("should set session data on successful call", function() {
      httpBackend.whenGET(userService.api_path+'session/').respond(fixture_userdata)
      userService.session().then(function(result) {
        expect(userService.user.logged_in).toBeTrue()
        expect(userService.user.data).toEqual(fixture_userdata)
      })
    })

    it("should clear session data on failed call", function() {
      httpBackend.whenGET(userService.api_path+'session/').respond(403, '')
      userService.session().then(function(result) {
        expect(userService.user.logged_in).toBeFalse()
        expect(userService.user.data).toBeNull()
      })
    })
  })
})
