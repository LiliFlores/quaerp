app.controller('GroupSetupController', ["$scope", "$rootScope", "GroupFactory", "$state", "AuthModulesFactory", "UserFactory", function($scope, $rootScope, GroupFactory, $state, AuthModulesFactory, UserFactory) {
    // Browser title
    $rootScope.page_title = "Group Setup";

    $rootScope.syst_selected_company = {"id":"6","cid":"inc","name":"Qualfin INC","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05\/20\/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"inc_db","created":"2017-02-01 12:47:25","updated":null};


    // $scope.main_group_to_show = $scope.group_list[0];
    // $scope.selectGroupToShow = function(group_index) {
    //     $scope.main_group_to_show = $scope.group_list[group_index];
    //     console.log($scope.main_group_to_show);
    // };

    // $scope.user = {};
    // $scope.edit_user = {};
    // $scope.edit_group = {};
    // $scope.edit_group_list = {};

    // TESTING
    // $scope.user.name = "Erick";
    // $scope.user.username = "ealvarez";
    // $scope.user.password = "password";
    // $scope.user.selected_group = "0";

    // $scope.accessmodules_list = [];
    //
    // $scope.group_list = [];
    // $scope.group = {};

    // TESTING
    // $scope.group.name = "group1";
    // $scope.group.day_sun = true;
    // $scope.group.day_mon = false;
    // $scope.group.day_tue = true;
    // $scope.group.day_wed = false;
    // $scope.group.day_thu = true;
    // $scope.group.day_fri = false;
    // $scope.group.day_sat = true;
    // $scope.group.login_start = "12:00";
    // $scope.group.login_end = "18:00";

    // AuthModulesFactory.get().then(function(response) {
    //     if (response.status) {
    //         response.results.map(function (current, index) {
    //             response.results[index].selected = false;
    //         });
    //         // $scope.accessmodules_list = response.results;
    //         $scope.group.accessmodules = response.results;
    //     }
    // });

    // $scope.loadGroups = function() {
    //     // GroupFactory.get($scope.company_id).then(function (response) {
    //     GroupFactory.get($scope.company_id).then(function (response) {
    //         if (response.status) {
    //             $scope.group_list = response.results;
    //
    //             if ($scope.group_list[0].users.length > 0) {
    //                 $scope.main_group_to_show = $scope.group_list[0];
    //             }
    //         }
    //     });
    // }

    // $scope.loadGroups();


    // $scope.deleteUser = function(user_to_delete) {
    //     // console.log(user_to_delete);
    //
    //     swal({
    //         title: "Are you sure?",
    //         text: "You will not be able to recover this user!",
    //         type: "warning",
    //         showCancelButton: true,
    //         confirmButtonClass: "btn-danger",
    //         confirmButtonText: "Yes, delete it!",
    //         cancelButtonText: "No, cancel.",
    //         closeOnConfirm: false,
    //         closeOnCancel: false,
    //         timer: 4000
    //     }, function(isConfirm) {
    //         if (isConfirm) {
    //             UserFactory.delete(user_to_delete.id).then(function (response) {
    //                 if (response.status) {
    //                     swal("Deleted!", "The user has been deleted.", "success");
    //                     $scope.loadGroups();
    //                 } else {
    //                     console.error(response);
    //                     throw new Error("error al eliminar usuario..");
    //                 }
    //             });
    //         } else {
    //             swal("Cancelled", "Your user is safe", "error");
    //         }
    //     });
    // };

    // $scope.openAddUserModal = function() {
    //     $("#addUserModal").modal("show");
    // };

    // $scope.userRowClick = function (access_module) {
    //     if (access_module.status) {
    //         access_module.status = 0;
    //     } else {
    //         access_module.status = 1;
    //     }
    // };

    // $scope.submitAddUserModal = function() {
    //     var payload = {
    //         "name": $scope.user.name,
    //         "username": $scope.user.username,
    //         "password": $scope.user.password,
    //         "group_id": $scope.group_list[$scope.user.selected_group].id,
    //         "auth_modules": $scope.group_list[$scope.user.selected_group].modules
    //     };
    //
    //     // console.log(payload);
    //
    //     UserFactory.create(payload).then(function (response) {
    //         if (response.status) {
    //             $("#addUserModal").modal("hide");
    //             swal({
    //                 title: "Good job!",
    //                 text: "The user has been added successfully!",
    //                 type: "success",
    //                 timer: 2000
    //             });
    //
    //             $scope.loadGroups();
    //
    //             $scope.user.name = "";
    //             $scope.user.username = "";
    //             $scope.user.password = "";
    //             $scope.user.selected_group = "0";
    //         } else {
    //             console.error(response);
    //             throw new Error("error al crear usuario..");
    //         }
    //     });
    //
    //     // console.log($scope.group_list);
    //
    //     // swal({
    //     //     title: "Good job!",
    //     //     text: "The user has been added successfully!",
    //     //     type: "success",
    //     //     timer: 2000
    //     // });
    //
    //     // $("#addUserModal").modal("hide");
    // };

    // $scope.openAddGroupModal = function() {
    //     $("#AddGroupModal").modal("show");
    // };
    //
    // $scope.submitAddGroup = function() {
    //     alert("asd");
    //
    //     var payload = {};
    //     payload = $scope.group;
    //     payload.company_id = $scope.company_id;
    //
    //     GroupFactory.create(payload).then(function (response) {
    //         if (response.status) {
    //             $("#addGroupModal").modal("hide");
    //             swal({
    //                 title: "Good job!",
    //                 text: "The group has been added successfully!",
    //                 type: "success",
    //                 timer: 2000
    //             });
    //
    //             $scope.group.name = "";
    //             $scope.group.day_sun = false;
    //             $scope.group.day_mon = false;
    //             $scope.group.day_tue = false;
    //             $scope.group.day_wed = false;
    //             $scope.group.day_thu = false;
    //             $scope.group.day_fri = false;
    //             $scope.group.day_sat = false;
    //
    //             $scope.loadGroups();
    //         } else {
    //             console.error(response);
    //             throw new Error("error al crear grupo..");
    //         }
    //     });
    // };



    // $scope.editUser = function (user) {
    //     UserFactory.getOne(user.id).then(function (response) {
    //         if (response.status) {
    //             // console.log(response.results.name);
    //             $scope.edit_user.id = user.id;
    //             $scope.edit_user.name = response.results.name;
    //             $scope.edit_user.username = response.results.username;
    //             $scope.edit_user.password = response.results.password;
    //             $scope.edit_user.auth_modules = response.results.auth_modules;
    //
    //             $("#editUserModal").modal("show");
    //         }
    //     });
    // };

    // $scope.submitEditUserModal = function() {
    //     var payload = $scope.edit_user;
    //     var user_id = $scope.edit_user.id;
    //     UserFactory.update(user_id, payload).then(function (response) {
    //         if (response.status) {
    //             $("#editUserModal").modal("hide");
    //             swal({
    //                 title: "Good job!",
    //                 text: "The User has been updated successfully!",
    //                 type: "success",
    //                 timer: 2000
    //             });
    //             $scope.loadGroups();
    //         } else {
    //             console.error(response);
    //             throw new Error("error al actualizar usuario..");
    //         }
    //     });
    // };


    // $scope.openEditGroupModal = function () {
    //     GroupFactory.get($scope.company_id).then(function (response) {
    //         if (response.status) {
    //             console.log(response.results);
    //             $scope.edit_group_list = response.results
    //             $("#editGroupModal").modal("show");
    //             //  $scope.edit_selected_group = 0;
    //         }
    //     });
    // };

    // $scope.submitEditGroup = function () {
    //     // console.log($scope.edit_selected_group);
    //     // console.log($scope.edit_group_list);
    //     var selected_group_index = $scope.edit_selected_group;
    //     console.log(selected_group_index);
    //     // console.log(selected_group_index);
    //     var payload = $scope.edit_group_list[selected_group_index];
    //     //
    //     console.log(payload);
    //     GroupFactory.update(payload.id, payload).then(function (response) {
    //         if (response.status) {
    //             $("#editGroupModal").modal("hide");
    //             swal({
    //                 title: "Good job!",
    //                 text: "The Group has been updated successfully!",
    //                 type: "success",
    //                 timer: 2000
    //             });
    //             $scope.loadGroups();
    //         }
    //     });
    // };

    // $scope.changeActiveStateUser = function(selected_user) {
    //     // console.log(selected_user.id);
    //
    //     var user_id = selected_user.id;
    //     UserFactory.changeActiveState(user_id).then(function(response){
    //         console.log(response);
    //         if (response.status) {
    //             swal({
    //                 title: "Good job!",
    //                 text: "The User has been updated successfully!",
    //                 type: "success",
    //                 timer: 2000
    //             });
    //             $scope.loadGroups();
    //         } else {
    //             console.error(response);
    //         }
    //     });
    // };

    // $scope.openDeleteGroupModal = function () {
    //     GroupFactory.get($scope.company_id).then(function (response) {
    //         if (response.status) {
    //             console.log(response.results);
    //             $scope.delete_group_list = response.results
    //             $("#deleteGroupModal").modal("show");
    //         }
    //     });
    // };

    // $scope.submitDeleteGroup = function () {
    //
    //     console.log(typeof($scope.delete_selected_group));
    //     console.log($scope.delete_selected_group);
    //     if (typeof($scope.delete_selected_group) != "undefined") {
    //         var current_group = $scope.delete_group_list[$scope.delete_selected_group];
    //
    //         if (current_group.users.length > 0) {
    //
    //             var alert_message = "The group that you are trying to delete still have {0} users!".format(
    //                 current_group.users.length
    //             );
    //             swal({
    //                 title: "Take it easy cowboy!",
    //                 text: alert_message,
    //                 type: "warning"
    //             });
    //         } else {
    //             GroupFactory.delete(current_group.id).then(function (response) {
    //                 if (response.status) {
    //                     swal({
    //                         title: "Good job!",
    //                         text: "The Group has been deleted successfully!",
    //                         type: "success",
    //                         timer: 2000
    //                     });
    //                     $("#deleteGroupModal").modal("hide");
    //                     $scope.loadGroups();
    //                 } else {
    //                     console.error(response);
    //                 }
    //             });
    //         }
    //     }
    //     // console.log($scope.delete_selected_group);
    //     // console.log($scope.delete_group_list);
    // };

    // plugins
    $('#login_start').formatter({
        'pattern': '{{99}}:{{99}}',
        'persistent': true
    });

    $('#login_end').formatter({
        'pattern': '{{99}}:{{99}}',
        'persistent': true
    });

}]);
