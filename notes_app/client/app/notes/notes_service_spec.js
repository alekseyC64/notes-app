'use strict';

describe('Service: Notes', function() {
  var notesService, httpBackend, $log

  var fixture_meta = {
    'limit': 20,
    'next': null,
    'offset': 0,
    'previous': null,
    'total_count': 1
  }

  var fixture_objects = [
    {
      'id': 1,
      'title': 'Sample Title',
      'content': 'Sample content',
      'owner': '/api/v1/user/1/',
      'resource_uri': '/api/v1/note/1/',
      'shared_with': [],
      'created_on': '2016-09-30T11:27:08.555998',
      'updated_on': '2016-09-30T11:27:08.555998'
    },
    {
      'id': 2,
      'title': 'Sample Title 2',
      'content': 'Sample content 2',
      'owner': '/api/v1/user/3/',
      'resource_uri': '/api/v1/note/2/',
      'shared_with': [],
      'created_on': '2016-09-30T11:27:08.555998',
      'updated_on': '2016-09-30T11:27:08.555998'
    },
    {
      'id': 3,
      'title': 'Sample Title',
      'content': 'Sample content',
      'owner': '/api/v1/user/1/',
      'resource_uri': '/api/v1/note/3/',
      'shared_with': [],
      'created_on': '2016-09-30T11:27:08.555998',
      'updated_on': '2016-09-30T11:27:08.555998'
    }
  ]

  var fixture_response = {
    'meta': fixture_meta,
    'objects': fixture_objects
  }

  beforeEach(module('notes.services'))
  beforeEach(module('test.templates'))
  beforeEach(inject(function(_notesService_, $httpBackend, _$log_) {
    notesService = _notesService_
    httpBackend = $httpBackend
    $log = _$log_
  }))

  it('binds a data object', function() {
    expect(notesService.data).toBeDefined()
  })

  describe("HTTP API tests", function() {
    afterEach(function() {
      httpBackend.flush()
      httpBackend.verifyNoOutstandingExpectation()
    })
    describe("Listing notes", function() {
      it('updates the data object on a list() call', function() {
        httpBackend.expectGET(notesService.api_path).respond(fixture_response)
        notesService.list().then(function(result) {
          expect(notesService.data.metadata).toEqual(fixture_meta)
          expect(notesService.data.notes).toEqual(fixture_objects)
        })
      })

      it('assigns an empty list to data on list() failure and logs a message', function() {
        httpBackend.expectGET(notesService.api_path).respond(403, '')
        notesService.list().then(function(result) {
          expect(notesService.data.notes.length).toEqual(0)
          expect($log.error.logs).toContain(['Problem with getting the note list from server'])
        })
      })
    })

    describe("READ method", function() {
      it("returns a note on a successful server call", function() {
        httpBackend.expectGET(notesService.api_path + '1/').respond(fixture_objects[0])
        notesService.read(1).then(function(result) {
          expect(result).toEqual(fixture_objects[0])
        })
      })

      it("returns null on a failed server call and logs a message", function() {
        httpBackend.expectGET(notesService.api_path + '1/').respond(403, '')
        notesService.read(1).then(function(result) {
          expect(result).toBeNull()
          expect($log.error.logs).toContain(['Problem with getting the note from server'])
        })
      })
    })

    describe("CREATE method", function() {
      it("returns true on a successful note creation", function() {
        httpBackend.expectPOST(notesService.api_path).respond('')
        notesService.create({}).then(function(result) {
          expect(result).toBe(true)
        })
      })

      it("returns false on a failed note creation and logs a message", function() {
        httpBackend.expectPOST(notesService.api_path).respond(403, '')
        notesService.create({}).then(function(result) {
          expect(result).toBe(false)
          expect($log.error.logs).toContain(['Problem with creating the note'])
        })
      })
    })

    describe("UPDATE method", function() {
      it("returns true on a successful note update", function() {
        httpBackend.expectPATCH(notesService.api_path+'1/').respond('')
        notesService.update(1, {}).then(function(result) {
          expect(result).toBe(true)
        })
      })

      it("returns false on a failed note update and logs a message", function() {
        httpBackend.expectPATCH(notesService.api_path+'1/').respond(403, '')
        notesService.update(1, {}).then(function(result) {
          expect(result).toBe(false)
          expect($log.error.logs).toContain(['Problem with updating the note'])
        })
      })
    })

    describe("DELETE method", function() {
      var deleted

      beforeEach(function() {
        notesService.data.metadata = fixture_meta
        notesService.data.notes = fixture_objects
        deleted = notesService.data.notes[0]
      })

      it("removes a note from the bound data on success", function() {
        httpBackend.expectDELETE(notesService.api_path+'1/').respond('')
        notesService.delete(1).then(function(result) {
          expect(notesService.data.notes.length).toEqual(2)
          expect(notesService.data.notes).not.toContain(deleted)
        })
      })

      it("returns null on deletion failure and logs a message", function() {
        httpBackend.expectDELETE(notesService.api_path+'1/').respond(403, '')
        notesService.delete(1).then(function(result) {
          expect(result).toBeNull()
          expect($log.error.logs).toContain(['Problem with deleting the note'])
        })
      })
    })
  })
})
