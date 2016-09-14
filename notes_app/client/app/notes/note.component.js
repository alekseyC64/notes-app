(function() {
  'use strict';

  function NoteCtrl() {
    var ctrl = this;
  };

  angular.module('notes').component('note', {
    templateUrl: 'templates/note.tpl.html',
    controller: NoteCtrl,
    bindings: {
      note: '<',
    }
  });
})();
