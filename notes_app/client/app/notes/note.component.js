(function() {
  'use strict';

  function NoteCtrl(notesService) {
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
    };
    ctrl.updateNote = function() {
      notesService.update(ctrl.note.id, ctrl.notecopy).then(function(status) {
        if (status) {
          ctrl.note.title = ctrl.notecopy.title;
          ctrl.note.content = ctrl.notecopy.content;
          ctrl.isEditing = false;
        } 
      })
    };
    ctrl.resetNote = function() {
      delete ctrl.notecopy.title;
      delete ctrl.notecopy.content;
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
