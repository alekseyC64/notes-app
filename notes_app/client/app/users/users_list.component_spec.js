'use strict';

describe('Component: Users List:', function () {

    beforeEach(module('notes'));

    var $componentController,
        $q,
        mockUserService,
        scope,
        ctrl;


    beforeEach(module(function($provide) {
        $provide.factory('userService', function() {
            return {
                'user': {'logged_in': false, 'data': null},
                'list': jasmine.createSpy('list').and.callFake(function() {
                    return $q.when({"data":{"meta":{"limit":5,"next":null,"offset":0,"previous":null,"total_count":5},"objects":[{"email":"admin@email.com","first_name":"Yauheni","id":1,"is_superuser":true,"last_name":"Sauchanka","resource_uri":"/api/v1/user/1/","username":"admin"},{"email":"iggy@email.com","first_name":"Iggy","id":2,"is_superuser":false,"last_name":"Pop","resource_uri":"/api/v1/user/2/","username":"iggy"},{"email":"fooboo@email.com","first_name":"Foo","id":3,"is_superuser":false,"last_name":"Boo","resource_uri":"/api/v1/user/3/","username":"foo"},{"email":"johndoe@email.com","first_name":"John","id":4,"is_superuser":false,"last_name":"Doe","resource_uri":"/api/v1/user/4/","username":"john"},{"email":"bobroe@email.com","first_name":"Bobby","id":5,"is_superuser":false,"last_name":"Roe","resource_uri":"/api/v1/user/5/","username":"bob"}]},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"params":{"limit":5,"offset":0},"url":"http://localhost:8000/api/v1/user/","headers":{"Accept":"application/json, text/plain, */*","X-CSRFToken":"DKTj4KeNHPEkIBqAH7TNg18LhUVdIeaW"}},"statusText":"OK"})
                }),
                'portion': jasmine.createSpy('list').and.callFake(function() {
                    return $q.when({"data":{"meta":{"limit":5,"next":null,"offset":0,"previous":null,"total_count":5},"objects":[{"email":"admin@email.com","first_name":"Yauheni","id":1,"is_superuser":true,"last_name":"Sauchanka","resource_uri":"/api/v1/user/1/","username":"admin"},{"email":"iggy@email.com","first_name":"Iggy","id":2,"is_superuser":false,"last_name":"Pop","resource_uri":"/api/v1/user/2/","username":"iggy"},{"email":"fooboo@email.com","first_name":"Foo","id":3,"is_superuser":false,"last_name":"Boo","resource_uri":"/api/v1/user/3/","username":"foo"},{"email":"johndoe@email.com","first_name":"John","id":4,"is_superuser":false,"last_name":"Doe","resource_uri":"/api/v1/user/4/","username":"john"},{"email":"bobroe@email.com","first_name":"Bobby","id":5,"is_superuser":false,"last_name":"Roe","resource_uri":"/api/v1/user/5/","username":"bob"}]},"status":200,"config":{"method":"GET","transformRequest":[null],"transformResponse":[null],"params":{"limit":5,"offset":0},"url":"http://localhost:8000/api/v1/user/","headers":{"Accept":"application/json, text/plain, */*","X-CSRFToken":"DKTj4KeNHPEkIBqAH7TNg18LhUVdIeaW"}},"statusText":"OK"})
                })
            }
        })
    }));

    beforeEach(inject(function(_$componentController_, _$q_, $rootScope, notesService, userService) {
        $componentController = _$componentController_;
        $q = _$q_;
        scope = $rootScope.$new(true);
        mockUserService = userService;
        ctrl = $componentController('usersList', ['mockUserService', 'scope']);
    }));

    it("should get an array of users when getUsers() get called", function() {
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 5
        };

        spyOn(ctrl, 'getUsers');

        ctrl.getUsers(paginationOptions);
        scope.$digest();

        expect(ctrl.getUsers).toHaveBeenCalledWith(paginationOptions);

        expect(mockUserService.portion).toHaveBeenCalledWith(paginationOptions);

        mockUserService.portion(paginationOptions).then(function (res) {
            expect(ctrl.gridOptions.data).toEqual(res.data.objects);
        });

        mockUserService.portion(paginationOptions).then(function (res) {
            expect(ctrl.gridOptions.totalItems).toEqual(res.meta.total_count);
        });
    });

    // it('should delete selected users and get an updated array of users when deleteSelected() get called', function () {
    //     spyOn(ctrl, 'deleteSelected');
    //     spyOn(ctrl.gridOptions, 'onRegisterApi');
    //     // spyOn(ctrl.gridApi.selection, 'getSelectedRows');
    //
    //     ctrl.gridOptions.onRegisterApi(gridApi);
    //
    //     expect(ctrl.gridOptions.onRegisterApi).toHaveBeenCalledWith(gridApi);
    //     expect(ctrl.gridApi).not.toBe(undefined);
    //     // expect(ctrl.gridApi.selection.getSelectedRows).toHaveBeenCalled();
    //
    //     ctrl.deleteSelected();
    //     expect(ctrl.deleteSelected).toHaveBeenCalled();
    // });
});
