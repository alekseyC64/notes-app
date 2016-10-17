'use strict';

describe('Component: Note', function() {
  var fixture_users = [
    {
      'email': 'demo0@example.com',
      'first_name': 'Charles',
      'id': 4,
      'last_name': 'Jones',
      'resource_uri': '/api/v1/user/4/',
      'username': 'demo_user_00'
    },
    {
      'email': 'demo1@example.com',
      'first_name': 'Susan',
      'id': 5,
      'last_name': 'Wilson',
      'resource_uri': '/api/v1/user/5/',
      'username': 'demo_user_01'
    },
    {
      'email': 'demo2@example.com',
      'first_name': 'Linda',
      'id': 6,
      'last_name': 'Martinez',
      'resource_uri': '/api/v1/user/6/',
      'username': 'demo_user_02'
    }
  ]

  var fixture_note = {
    'id': 2,
    'title': 'Sample title',
    'content': 'Sample content',
    'owner': '/api/v1/user/2/',
    'shared_with': [fixture_users[0], fixture_users[2]],
    'created_on': "2016-09-09T09:35:12.504Z",
    'updated_on': "2016-09-12T14:28:31.128Z"
  }

  describe('Controller', function() {
    var $componentController, $q, scope, mockNotesService, ctrl

    beforeEach(module('notes'))
    beforeEach(module(function($provide) {
      $provide.factory('notesService', function() {
        var fct = this
        fct.isSuccessful = true
        return {
          update: jasmine.createSpy('update').and.callFake(function() {
            return $q.when(fct.isSuccessful)
          }),
          delete: jasmine.createSpy('delete'),
          setSuccessful: function(bool) {
            fct.isSuccessful = bool
          }
        }
      })
    }))
    beforeEach(inject(function(_$componentController_, _$q_, $rootScope, notesService) {
      $componentController = _$componentController_
      $q = _$q_
      mockNotesService = notesService
      scope = $rootScope.$new(true)
      ctrl = $componentController('note', null, {'note': fixture_note})
    }))

    it('sets working copy state when editing is toggled', function() {
      ctrl.toggleEditing()
      expect(ctrl.isEditing).toBe(true)
      expect(ctrl.notecopy.title).toEqual(fixture_note.title)
      expect(ctrl.notecopy.content).toEqual(fixture_note.content)
      expect(ctrl.notecopy.shared_with).toEqual(ctrl.notecopy.shared_with)
    })

    it('calls the delete method of notesService to delete note', function() {
      ctrl.deleteNote()
      expect(mockNotesService.delete).toHaveBeenCalledWith(fixture_note.id);
    })

    it('uses noteService to update note', function() {
      ctrl.notecopy.title = 'New Title'
      ctrl.notecopy.content = 'New Content'
      ctrl.notecopy.selectedUsers = fixture_users.slice(0, 2)
      ctrl.updateNote()
      scope.$digest()
      expect(ctrl.note.title).toEqual(ctrl.notecopy.title)
      expect(ctrl.note.content).toEqual(ctrl.notecopy.content)
      expect(ctrl.note.shared_with).toEqual(ctrl.notecopy.selectedUsers)
      expect(mockNotesService.update).toHaveBeenCalledWith(fixture_note.id, {
        'title': ctrl.notecopy.title,
        'content': ctrl.notecopy.content,
        'shared_with': fixture_users.slice(0, 2).map((n) => n.resource_uri),
        'selectedUsers': ctrl.notecopy.selectedUsers
      })
    })

    it('does not touch the original data on update failure', function() {
      ctrl.notecopy.title = 'New Title'
      ctrl.notecopy.content = 'New Content'
      ctrl.notecopy.selectedUsers = []
      mockNotesService.setSuccessful(false)
      ctrl.updateNote()
      scope.$digest()
      expect(ctrl.note).toEqual(fixture_note)
    })

    it('updates selected users when updateSelected method is called', function() {
      var selected = fixture_users.slice(0, 2)
      ctrl.updateSelected(selected)
      expect(ctrl.notecopy.selectedUsers).toEqual(selected)
    })

    it('correctly resets note editing state', function() {
      ctrl.resetNote()
      expect(ctrl.isEditing).toBe(false)
      expect(ctrl.notecopy.title).not.toBeDefined()
      expect(ctrl.notecopy.content).not.toBeDefined()
      expect(ctrl.notecopy.shared_with).not.toBeDefined()
      expect(ctrl.notecopy.selectedUsers).not.toBeDefined()
    })
  })

  describe('Template', function() {
    var $filter, element, scope, httpBackend
    beforeEach(module('notes'))
    beforeEach(module('test.templates'))

    beforeEach(inject(function(_$rootScope_, _$compile_, _$filter_, $httpBackend, userService) {
      var $compile = _$compile_,
          $rootScope = _$rootScope_
      $filter = _$filter_
      $httpBackend.whenGET(userService.api_path).respond('')

      scope = $rootScope.$new(true)
      element = angular.element('<note note="external" is-editable="editable"></note>')
      element = $compile(element)(scope)
    }))

    it('renders a bound note data', function() {
      scope.external = fixture_note
      scope.$digest()
      var controller = element.controller('note')
      expect(controller.note).toEqual(scope.external)
      expect(element.html()).toContain(fixture_note.title)
      expect(element.html()).toContain(fixture_note.content)
      for (var user in controller.note.shared_with) {
        expect(element.html()).toContain(controller.note.shared_with[user].username)
      }
      expect(element.html()).toContain($filter('date')(controller.note.created_on))
      expect(element.html()).toContain($filter('date')(controller.note.updated_on))
    })

    it('binds working data to note in editing mode', function() {
      scope.$digest()
      var controller = element.controller('note')
      controller.isEditing = true
      controller.notecopy.title = 'Foo'
      controller.notecopy.content = 'Bar'
      controller.notecopy.selectedUsers = fixture_users
      scope.$digest()
      scope.$digest()

      var title = element.find('input').eq(0),
          textarea = element.find('textarea').eq(0)

      expect(title.val()).toEqual(controller.notecopy.title)
      expect(textarea.val()).toEqual(controller.notecopy.content)
    })

    it('renders edit and delete buttons for editable notes', function() {
      scope.external = {
        'title': 'Note Title',
        'content': 'Note contend'
      }
      scope.editable = true
      scope.$digest()
      var buttons = element.find('button')
      expect(buttons.length).toEqual(2)
      expect(buttons.eq(0).text()).toContain('E')
      expect(buttons.eq(1).text()).toContain('X')
    })

    it('renders ok and cancel buttons for notes in editing mode', function() {
      scope.editable = true
      scope.$digest()
      element.controller('note').isEditing = true
      scope.$digest()
      var buttons = element.find('button')
      expect(buttons.length).toEqual(2)
      expect(buttons.eq(0).text()).toEqual('Cancel')
      expect(buttons.eq(1).text()).toEqual('OK')
    })

    it('does not render buttons when note is not editable', function() {
      scope.editable = false
      scope.$digest()
      expect(element.find('button').length).toEqual(0)
    })
  })
})
