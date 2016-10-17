'use strict';

describe('Component: Notes List', function() {
  var $componentController,
      $q,
      mockNotesService,
      mockUserService,
      scope,
      ctrl

  var fixture_metadata = {
    'limit': 5,
    'next': '/api/v1/note/?limit=5&offset=5',
    'offset': 0,
    'previous': null,
    'total_count': 196
  }

  var fixture_notes = [
    {
      'content': 'Content',
      'created_on': '2016-10-04T10:15:39.336508',
      'id': 23,
      'owner': '/api/v1/user/1/',
      'resource_uri': '/api/v1/note/23/',
      'shared_with': [],
      'title': 'Title',
      'updated_on': '2016-10-04T12:49:43.392882'
    },
    {
     'content': 'ffsafasfsa',
     'created_on': '2016-10-04T10:29:29.037702',
     'id': 24,
     'owner': '/api/v1/user/1/',
     'resource_uri': '/api/v1/note/24/',
     'shared_with': [
       {
         'email': 'tester@example.com',
         'first_name': 'Tester',
         'id': 2,
         'last_name': 'Coolguy',
         'resource_uri': '/api/v1/user/2/',
         'username': 'test'
       }
     ],
     'title': 'admin',
     'updated_on': '2016-10-04T10:29:29.037744'
    },
    {
     'content': 'dsa',
     'created_on': '2016-10-04T10:31:35.951008',
     'id': 25,
     'owner': '/api/v1/user/1/',
     'resource_uri': '/api/v1/note/25/',
     'shared_with': [],
     'title': 'das',
     'updated_on': '2016-10-04T10:38:29.990375'
    },
    {
     'content': 'das',
     'created_on': '2016-10-04T10:31:41.934445',
     'id': 26,
     'owner': '/api/v1/user/1/',
     'resource_uri': '/api/v1/note/26/',
     'shared_with': [],
     'title': 'das',
     'updated_on': '2016-10-04T10:31:41.934478'
    },
    {
     'content': 'dsadasdas',
     'created_on': '2016-10-04T10:31:47.674048',
     'id': 27,
     'owner': '/api/v1/user/1/',
     'resource_uri': '/api/v1/note/27/',
     'shared_with': [],
     'title': 'dsadas',
     'updated_on': '2016-10-04T10:38:21.747272'
    }
  ]

  beforeEach(module('notes'))

  beforeEach(module(function($provide) {
    $provide.factory('notesService', function() {
      return {
        'data': {'metadata': {}, 'notes': []},
        'list': jasmine.createSpy('list').and.callFake(function() {
          return $q.when(self.notes)
        }),
        '$set': function(metadata, notes) {
          this.data = {'metadata': metadata, 'notes': notes}
        }
      }
    })

    $provide.factory('userService', function() {
      return {
        'user': {
          'data': {
            'resource_uri': '/api/v1/user/1/'
          }
        }
      }
    })
  }))

  beforeEach(inject(function(_$componentController_, _$q_, $rootScope, notesService, userService) {
    $componentController = _$componentController_
    $q = _$q_
    scope = $rootScope.$new(true)
    mockNotesService = notesService
    mockUserService = userService
    ctrl = $componentController('notesList', ['mockNotesService', 'mockUserService'])
  }))

  it('uses notes service to fetch notes and bind them to controller variables', function() {
    mockNotesService.$set(fixture_metadata, fixture_notes)
    ctrl.update()
    scope.$digest()
    expect(mockNotesService.list).toHaveBeenCalled()
    expect(ctrl.metadata).toBe(mockNotesService.data.metadata)
    expect(ctrl.notes).toBe(mockNotesService.data.notes)
  })

  it('passes note limit and offset from the controller when fetching notes', function() {
    var offset = (currentPage, limit) => ((currentPage - 1) * limit)
    ctrl.currentPage = 4
    ctrl.noteLimit = 80
    ctrl.update()
    expect(mockNotesService.list).toHaveBeenCalledWith(ctrl.noteLimit, offset(ctrl.currentPage, ctrl.noteLimit))
  })
})
