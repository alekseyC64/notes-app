(function() {
  'use strict';

  NotesListviewCtrl.$inject = ['notesService', 'userService'];
  function NotesListviewCtrl(notesService, userService) {
    var ctrl = this;
    ctrl.userService = userService;
    ctrl.currentPage = 1;
    ctrl.noteLimit = 20;
    ctrl.update = function() {
      notesService.list(ctrl.noteLimit, ((ctrl.currentPage - 1) * ctrl.noteLimit))
      .then(function(response) {
        ctrl.metadata = notesService.data.metadata;
        ctrl.notes = notesService.data.notes;
      });
    };
    ctrl.update();
  }

  angular.module('notes').component('notesListList', {
    templateUrl: 'templates/notes_list_listview.tpl.html',
    controller: NotesListviewCtrl
  });
})();
