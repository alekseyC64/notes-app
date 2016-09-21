(function() {
  'use strict';

  NoteAddFormCtrl.$inject = ['notesService', 'userService'];
  function NoteAddFormCtrl(notesService, userService) {
    var self = this;
    this.note = {};
    this.users = [];
    this.alert_state = {};
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
        if (response !== null) {
          self.alert_state.visible = true;
          self.alert_state.message = 'Note successfully added.';
          self.alert_state.severity = 'success';
          self.form.$setPristine();
          self.reset();
        } else {
          self.alert_state.visible = true;
          self.alert_state.message = 'Problem with creating the note';
          self.alert_state.severity = 'error';
          self.locked = false;
        }
      });
    };
  };

  angular.module('notes').component('noteAddForm', {
    'templateUrl': 'templates/note_add_form.tpl.html',
    'controller': NoteAddFormCtrl
  });
})();
