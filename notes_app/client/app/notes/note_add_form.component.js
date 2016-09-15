(function() {
  'use strict';

  NoteAddFormCtrl.$inject = ['notesService'];
  function NoteAddFormCtrl(notesService) {
    this.note = {};
    this.submit = function() {
      notesService.create(this.note);
    };
  };

  angular.module('notes').component('noteAddForm', {
    'templateUrl': 'templates/note_add_form.tpl.html',
    'controller': NoteAddFormCtrl
  });
})();
