(function() {
  'use strict';

  NoteCtrl.$inject = ['notesService', 'userService'];
  function NoteCtrl(notesService) {
    var ctrl = this;
    ctrl.isEditing = false;
    ctrl.notecopy = {};
    ctrl.deleteNote = function () {
      notesService.delete(this.note.id);
    };
    ctrl.toggleEditing = function() {
      ctrl.isEditing = !ctrl.isEditing;
      ctrl.notecopy.title = ctrl.note.title;
      ctrl.notecopy.content = ctrl.note.content;
      ctrl.notecopy.selectedUsers = ctrl.note.shared_with;
    };
    ctrl.updateNote = function() {
      ctrl.notecopy.shared_with = ctrl.notecopy.selectedUsers.map(function(user) {
        return user.resource_uri;
      });
      notesService.update(ctrl.note.id, ctrl.notecopy).then(function(status) {
        if (status) {
          ctrl.note.title = ctrl.notecopy.title;
          ctrl.note.content = ctrl.notecopy.content;
          ctrl.note.shared_with = ctrl.notecopy.selectedUsers;
          ctrl.note.updated_on = new Date();
          ctrl.isEditing = false;
        }
      })
    };
    ctrl.updateSelected = function(selected) {
      ctrl.notecopy.selectedUsers = selected;
    }
    ctrl.resetNote = function() {
      delete ctrl.notecopy.title;
      delete ctrl.notecopy.content;
      delete ctrl.notecopy.selectedUsers;
      delete ctrl.notecopy.shared_with;
      ctrl.isEditing = false;
    };
  }

  angular.module('notes').component('note', {
    templateUrl: 'templates/note.tpl.html',
    controller: NoteCtrl,
    bindings: {
      note: '<',
      isEditable: '<'
    }
  });
})();
