(function() {
  'use strict';

  NoteAddFormCtrl.$inject = ['notesService', 'userService'];
  function NoteAddFormCtrl(notesService, userService) {
    var self = this;
    this.note = {};
    this.users = [];
    this.locked = false;

    userService.list().then(function(response) {
      self.users = response.objects;
    }).catch(function(response) {
      console.log('Error accessing user data');
    });

    this.reset = function() {
      self.locked = false;
      self.note['title'] = '';
      self.note['content'] = '';
    }

    this.submit = function() {
      self.locked = true;
      notesService.create(this.note).then(function(response) {
        self.message = 'Note added successfully!';
        self.form.$setPristine();
        self.reset();
      }).catch(function(response) {
        self.message = 'Problem communicating with server.';
        self.locked = false;
      });
    };
  };

  angular.module('notes').component('noteAddForm', {
    'templateUrl': 'templates/note_add_form.tpl.html',
    'controller': NoteAddFormCtrl
  });
})();
