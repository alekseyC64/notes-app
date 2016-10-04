(function() {
  'use strict';

  NoteCtrl.$inject = ['notesService', 'userService'];
  function NoteCtrl(notesService, userService) {
    var ctrl = this;
    ctrl.isEditing = false;
    ctrl.notecopy = {};
    ctrl.deleteNote = function () {
      notesService.delete(this.note.id);
    };
    ctrl.toggleEditing = function() {
      ctrl.isEditing = !ctrl.isEditing;
      ctrl.notecopy['title'] = ctrl.note.title;
      ctrl.notecopy['content'] = ctrl.note.content;
      ctrl.notecopy['shared_with'] = ctrl.note.shared_with;
    };
    ctrl.updateNote = function() {
      notesService.update(ctrl.note.id, ctrl.notecopy).then(function(status) {
        if (status) {
          ctrl.note.title = ctrl.notecopy.title;
          ctrl.note.content = ctrl.notecopy.content;
          ctrl.note.shared_with = ctrl.notecopy.shared_with;
          ctrl.isEditing = false;
        }
      })
    };
    ctrl.updateSelected = function(selected) {
      ctrl.notecopy.shared_with = selected;
    }
    ctrl.resetNote = function() {
      delete ctrl.notecopy.title;
      delete ctrl.notecopy.content;
      delete ctrl.notecopy.shared_with;
      ctrl.isEditing = false;
    };
  }

  angular.module('notes').component('note', {
    templateUrl: 'templates/note.tpl.html',
    controller: NoteCtrl,
    bindings: {
      note: '<'
    }
  });
})();
