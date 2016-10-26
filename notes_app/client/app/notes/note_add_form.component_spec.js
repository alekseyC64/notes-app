describe('Component: Add Note Form', function() {
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

  beforeEach(module('notes'))
  beforeEach(module('test.templates'))

  describe('Controller', function() {
    var $componentController, $q, notesService, ctrl, scope

    beforeEach(module(function($provide) {
      $provide.factory('notesService', function() {
        var fct = this
        fct.isSuccessful = true
        return {
          'create': jasmine.createSpy('create').and.callFake(function() {
            return $q.when(fct.isSuccessful)
          }),
          'setSuccessful': function(bool) {
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
      ctrl = $componentController('noteAddForm', null)
    }))

    it('should update selected users in controller when updateSelected is called', function() {
      expect(ctrl.selectedUsers).toEqual([])
      var selected = [fixture_users[0], fixture_users[2]]
      ctrl.updateSelected(selected)
      expect(ctrl.selectedUsers).toEqual(selected)
    })

    it('should reset correctly', function() {
      ctrl.locked = true
      ctrl.note.title = 'Foo'
      ctrl.note.content = 'Bar'
      ctrl.selectedUsers = fixture_users
      ctrl.reset()
      expect(ctrl.locked).toBe(false)
      expect(ctrl.selectedUsers.length).toEqual(0)
      expect(ctrl.note.title).toEqual('')
      expect(ctrl.note.content).toEqual('')
    })

    it('should pass correct data to userService to add notes', function() {
      ctrl.note.title = 'Foo'
      ctrl.note.content = 'Bar'
      ctrl.selectedUsers = fixture_users.slice(1, 3)
      ctrl.submit()
      expect(ctrl.locked).toEqual(true)
      expect(ctrl.note.shared_with).toEqual(ctrl.selectedUsers.map((u) => u.resource_uri))
      expect(mockNotesService.create).toHaveBeenCalledWith({
        'title': 'Foo',
        'content': 'Bar',
        'shared_with': ctrl.selectedUsers.map((u) => u.resource_uri)
      })
    })

    it('should show success message and reset form on success', function() {
      ctrl.reset = jasmine.createSpy('reset')
      ctrl.form = jasmine.createSpyObj('form', ['$setPristine'])
      ctrl.submit()
      scope.$digest()
      expect(ctrl.alert_state.visible).toBe(true)
      expect(ctrl.alert_state.severity).toEqual('success')
      expect(ctrl.alert_state.message).toEqual('Note successfully added.')
      expect(ctrl.reset).toHaveBeenCalled()
    })

    it('should show failure message and retain note state on failure', function() {
      mockNotesService.setSuccessful(false)
      ctrl.submit()
      scope.$digest()
      expect(ctrl.locked).toBe(false)
      expect(ctrl.alert_state.visible).toBe(true)
      expect(ctrl.alert_state.message).toEqual('Problem with creating the note')
      expect(ctrl.alert_state.severity).toEqual('error')
    })
  })

  describe('Template', function() {
    var $httpBackend, element, scope
    beforeEach(module(function($urlRouterProvider) {
      $urlRouterProvider.deferIntercept()
    }))
    beforeEach(inject(function($rootScope, $compile, _$httpBackend_, userService) {
      httpBackend = _$httpBackend_
      scope = $rootScope.$new(true)
      element = angular.element('<note-add-form></note-add-form>')
      element = $compile(element)(scope)
      httpBackend.whenGET(userService.api_path).respond('')
      scope.$digest()
    }))

    it('should contain alert panel and user selector', function() {
      expect(element.find('alert').length).toEqual(1)
      expect(element.find('user-selector').length).toEqual(1)
    })

    it('should require the title field', function() {
      title = element.find('input').eq(0)
      wrapper = title.parent()
      expect(wrapper.hasClass('has-error')).toBe(false)
      expect(wrapper.hasClass('has-success')).toBe(false)
      title.val('foo')
      title.triggerHandler('input')
      expect(wrapper.hasClass('has-error')).toBe(false)
      expect(wrapper.hasClass('has-success')).toBe(true)
      title.val('')
      title.triggerHandler('input')
      expect(wrapper.hasClass('has-error')).toBe(true)
      expect(wrapper.hasClass('has-success')).toBe(false)
    })

    it('should require the content field', function() {
      content = element.find('textarea').eq(0)
      wrapper = content.parent()
      expect(wrapper.hasClass('has-error')).toBe(false)
      expect(wrapper.hasClass('has-success')).toBe(false)
      content.val('foo')
      content.triggerHandler('input')
      expect(wrapper.hasClass('has-error')).toBe(false)
      expect(wrapper.hasClass('has-success')).toBe(true)
      content.val('')
      content.triggerHandler('input')
      expect(wrapper.hasClass('has-error')).toBe(true)
      expect(wrapper.hasClass('has-success')).toBe(false)
    })

    it('should allow submission only for valid data', function() {
      title = element.find('input').eq(0)
      content = element.find('textarea').eq(0)
      submit = element.find('input').eq(2)

      expect(submit.prop('disabled')).toBe(true)
      title.val('foo').triggerHandler('input')
      expect(submit.prop('disabled')).toBe(true)
      content.val('bar').triggerHandler('input')
      expect(submit.prop('disabled')).toBe(false)
      title.val('').triggerHandler('input')
      expect(submit.prop('disabled')).toBe(true)
    })

    it('should block submit button when form is locked', function() {
      title = element.find('input').eq(0)
      content = element.find('textarea').eq(0)
      submit = element.find('input').eq(2)

      title.val('foo').triggerHandler('input')
      content.val('bar').triggerHandler('input')

      element.controller('noteAddForm').locked = true
      scope.$digest()
      expect(submit.prop('disabled')).toBe(true)
    })
  })
})
