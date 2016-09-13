(function() {
  'use strict';

  NotesCtrl.$inject = ['notesService'];

  function NotesCtrl(notesService) {
    var ctrl = this;
  };

  angular.module('notes').component('notesList', {
    templateUrl: 'templates/notes.tpl.html',
    controller: NotesCtrl,
    bindings: {
      notes: '<'
    }
  });
})();
