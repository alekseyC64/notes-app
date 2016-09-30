(function() {
  'use strict';

  function NoteCtrl(notesService) {
    var ctrl = this;
    ctrl.deleteNote = function () {
      notesService.delete(this.note.id);
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
