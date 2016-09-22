(function() {
  'use strict';

  NotesCtrl.$inject = ['notesService'];

  function NotesCtrl(notesService) {
    var ctrl = this;
    ctrl.currentPage = 1;
    ctrl.notes = undefined;
    ctrl.metadata = undefined;
    ctrl.noteLimit = 20;
    ctrl.update = function() {
      notesService.list(
        ctrl.noteLimit,
        notesService.pagenumToOffset(ctrl.currentPage, ctrl.noteLimit)
      ).then(function(response) {
        ctrl.metadata = response.meta;
        ctrl.notes = response.objects;
      })
    };
    ctrl.update();
  };

  angular.module('notes').component('notesList', {
    templateUrl: 'templates/notes_list.tpl.html',
    controller: NotesCtrl
  });
})();
