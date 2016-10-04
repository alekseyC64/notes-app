(function() {
  'use strict';

  NoteAddFormCtrl.$inject = ['notesService', 'userService'];
  function NoteAddFormCtrl(notesService, userService) {
    var self = this;
    this.note = {};
    this.users = [];
    this.selectedUsers = [];
    this.alert_state = {};
    this.locked = false;

    this.updateSelected = function(selected) {
      this.selectedUsers = selected;
    }

    this.reset = function() {
      self.locked = false;
      self.selectedUsers.splice(0, self.selectedUsers.length);
      self.note['title'] = '';
      self.note['content'] = '';
    }

    this.submit = function() {
      self.locked = true;
      self.note.shared_with = self.selectedUsers.map(function(user) {
        return user.resource_uri;
      });
      notesService.create(this.note).then(function(is_added) {
        if (is_added) {
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
