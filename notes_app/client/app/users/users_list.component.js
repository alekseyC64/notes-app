(function() {
  'use strict';

  UsersCtrl.$inject = ['userService', '$scope'];
  function UsersCtrl(userService, $scope) {
    var ctrl = this;
    ctrl.users = [];
    ctrl.gridOptions = {
      onRegisterApi: function( gridApi ) {
        ctrl.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, ctrl.saveRow);
      },
      data: [],
      paginationPageSize: 5,
      paginationPageSizes: [5,10,25],
      enableRowHeaderSelection: true,
      multiSelect: true,
      enableSelectAll: false,
      columnDefs: [
        {name: 'id', enableCellEdit: false, width: '5%' },
        {name: 'first_name', enableCellEdit: true},
        {name: 'last_name', enableCellEdit: true},
        {name: 'username', enableCellEdit: true},
        {name: 'email', field: 'email', enableCellEdit: true},
        {name: 'is_superuser', enableCellEdit: false, width: '10%' },
      ],
    };
    ctrl.saveRow = saveRow;
    ctrl.deleteSelected = deleteSelected;
    getUsers();

    function saveRow( rowEntity ) {
      ctrl.gridApi.rowEdit.setSavePromise( rowEntity, userService.update(rowEntity.id, rowEntity));
    };

    function deleteSelected() {
      var selected = ctrl.gridApi.selection.getSelectedRows();
      for (var i = 0; i < selected.length; i++) {
        userService.delete(selected[i].id).then(function(response){
          getUsers();
        }).catch(function(error){
          console.log(error);
        });
      }
    };

    function getUsers() {
      userService.list().then(function(res){
        ctrl.gridOptions.data = res.objects;
      });
    }
  };

  angular.module('notes').component('usersList', {
    'templateUrl': 'templates/users_list.tpl.html',
    'controller': UsersCtrl,
  });
})();
