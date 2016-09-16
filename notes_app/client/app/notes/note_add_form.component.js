(function() {
  'use strict';

  NoteAddFormCtrl.$inject = ['notesService', 'userService'];
  function NoteAddFormCtrl(notesService, userService) {
    var self = this;
    this.note = {};
    this.users = [];

    userService.list().then(function(response) {
      self.users = response.objects;
    }).catch(function(response) {
      console.log('Error accessing user data');
    });

    this.submit = function() {
      notesService.create(this.note);
    };
  };

  angular.module('notes').component('noteAddForm', {
    'templateUrl': 'templates/note_add_form.tpl.html',
    'controller': NoteAddFormCtrl
  });
})();
