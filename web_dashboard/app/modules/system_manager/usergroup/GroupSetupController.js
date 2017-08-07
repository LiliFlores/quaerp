app.controller('GroupSetupController', ["$scope", "$rootScope", "GenericFactory", "$state", "$q", function($scope, $rootScope, GenericFactory, $state, $q) {
    // Browser title
    $rootScope.page_title = "Group Setup";

    // $rootScope.syst_selected_company = {"id":"6","cid":"inc","name":"Qualfin INC","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05\/20\/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"inc_db","created":"2017-02-01 12:47:25","updated":null};

    $scope.smmodules_list = [];
    $scope.loadModules = function() {
        GenericFactory.get("smmodules").then(function(response) {
            if (response.status) {
                $scope.smmodules_list = response.results;
            }
        });
    };
    $scope.loadModules();

    $scope.selected_smusergroup = {};
    $scope.smusergroup_list = [];
    $scope.loadUserGroups = function() {
        GenericFactory.get("smusergroup").then(function(response) {
            if (response.status) {
                $scope.smusergroup_list = response.results;

                GenericFactory.get("smusergrouphassmuser").then(function(response) {
                    // console.log(response);
                    if (response.status) {
                        $scope.smusergroup_list.forEach(function(group) {
                            group.user_list = [];
                            response.results.forEach(function(row) {
                                if (group.id == row.smusergroup.id) {
                                    group.user_list.push(row.smuser);
                                }
                            });
                        });
                    }
                });
            }
        });
    };
    $scope.loadUserGroups();

    // $scope.main_group_to_show = $scope.group_list[0];
    $scope.user_list_to_show = [];
    // $scope.selected_group = {};
    $scope.selected_smusergroup = {};
    $scope.selectGroupToShow = function(selected_group) {
        $scope.selected_smusergroup = selected_group;
        // console.log($scope.selected_smusergroup);
        if (selected_group.user_list.length > 0) {
            $scope.user_list_to_show = selected_group.user_list;
        } else {
            swal("Oops!!", "There is no users in this group.", "warning");
            $scope.user_list_to_show = [];
        }
    };

    $scope.blockUser = function(user) {
        var payload = {};
        payload.id = user.id;
        payload.active = !(user.active == "1");
        GenericFactory.put("smuser", payload).then(function(response) {
            user.active = payload.active;
            alertify.success("User have succesfully been updated");
        });
    };

    $scope.rowClick = function(module) {
        if (typeof(module.selected) == "undefined") {
            module.selected = true;
        } else {
            if (module.selected) {
                module.selected = false;
            } else {
                module.selected = true;
            }
        }
    };

    $scope.selected_company_edit_form = {};
    $scope.selectCompanyEditUser = function(company) {
        $scope.selected_company_edit_form = company;
        console.log($scope.selected_company_edit_form);
    };

    $scope.user_edit_form = {};
    $scope.initEditUserData = function() {
        // console.log($scope.selected_smusergroup);
        $scope.user_edit_form.group_name = $scope.selected_smusergroup.name;

        $scope.user_edit_form.company_list = [];
        $scope.user_edit_form.company_list = angular.copy($scope.company_list);
        $scope.user_edit_form.company_list.forEach(function(company, index) {
            $scope.user_edit_form.company_list[index].modules = [];
            $scope.user_edit_form.company_list[index].modules = angular.copy($scope.smmodules_list);
        });

        // $scope.selected_company = {};

        GenericFactory.get("smuserhassmmodules").then(function(response) {
            if (response.status) {

                response.results.forEach(function(row) {
                    $scope.user_edit_form.company_list.forEach(function(company) {
                        // console.log(row);
                        // console.log(company.id + " " + row.smcompany.id + "/" + $scope.selected_smusergroup.id + " " + row.smusergroup.id);
                        if (company.id == row.smcompany.id &&
                            $scope.selected_smusergroup.id == row.smusergroup.id &&
                            $scope.user_edit_form.id == row.smuser.id) {

                            company.modules.forEach(function(module) {
                                if (!module.selected) {
                                    if (row.smmodules.id == module.id) {
                                        module.selected = true;
                                    } else {
                                        module.selected = false;
                                    }
                                }
                            });
                        }
                    });
                });

            }
        });

    };

    $scope.submitEditUser = function() {

        var user_payload = angular.copy($scope.user_edit_form);
        var modules_payload = angular.copy(user_payload.company_list);

        delete user_payload.group_name;
        delete user_payload.company_list;
        delete user_payload.usergroup_list;
        delete user_payload.selected_group;

        GenericFactory.put("smuser", user_payload).then(function(response) {
            if (response.status) {

                let delete_prom_list = [];
                GenericFactory.get("smuserhassmmodules").then(function(userhasmodules) {
                    if (userhasmodules.status) {
                        userhasmodules.results.forEach(function(row) {
                            if (row.smuser.id == user_payload.id) {
                                delete_prom_list.push(GenericFactory.delete("smuserhassmmodules", row.smuser.id));
                            }
                        })
                    }
                    // console.log(userhasmodules);
                });

                $q.all(delete_prom_list).then(function(response) {

                    let post_module_prom_list = [];
                    modules_payload.forEach(function(company) {
                        company.modules.forEach(function(module) {
                            if (module.selected) {

                                let payload = {};
                                payload.smusergroup = {};
                                payload.smusergroup.id = $scope.selected_smusergroup.id;
                                payload.smcompany = {};
                                payload.smcompany.id = company.id;
                                payload.smmodules = {};
                                payload.smmodules.id = module.id;
                                payload.smuser = {};
                                payload.smuser.id = user_payload.id;

                                post_module_prom_list.push(GenericFactory.post("smuserhassmmodules", payload));
                            }
                        });
                    });

                    $q.all(post_module_prom_list).then(function(response) {

                        $scope.user_edit_form.company_list = [];
                        $scope.selected_company_edit_form.modules = [];
                        $scope.user_edit_form = {};

                        $("#EditUserModal").modal("hide");

                        swal({
                            title: "Success!",
                            text: "User edited successfully",
                            type: "success"
                        });
                    });

                });


            } else {
                swal("Cancelled", "Unespected error, contact admin", "error");
                console.error("-------->");
                console.error(response);
                console.error("-------->");
            }
        });

    };

    $scope.openEditUserModal = function(user) {
        $("#EditUserModal").modal("show");
        $scope.user_edit_form = user;
        $scope.initEditUserData();
    };

    $scope.deleteUser = function(user) {
        $scope.user_list_to_show.forEach(function(current_user, index) {
            if (user.id == current_user.id) {
                $scope.user_list_to_show.splice(index, 1);

                let prom_list = [];
                GenericFactory.get("smusergrouphassmuser").then(function(response) {
                    if (response.status) {
                        response.results.forEach(function(row) {
                            if (row.smuser.id == user.id) {
                                prom_list.push(GenericFactory.delete("smusergrouphassmuser", row.id));
                            }
                        });
                    }
                });

                GenericFactory.get("smuserhassmmodules").then(function(response) {
                    if (response.status) {
                        response.results.forEach(function(row) {
                            if (row.smuser.id == user.id) {
                                prom_list.push(GenericFactory.delete("smuserhassmmodules", row.id));
                            }
                        });
                    }
                });

                $q.all(prom_list).then(function(response) {
                    GenericFactory.delete("smuser", user.id).then(function(response) {
                        if (response.status) {
                            alertify.success("User deleted");
                        } else {
                            alertify.error("User deleted");
                        }
                    });
                });

            }
        });
    };


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
    //     // GenericFactory.get($scope.company_id).then(function (response) {
    //     GenericFactory.get($scope.company_id).then(function (response) {
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

    $scope.initCreateUserGroupData = function() {
        $scope.usergroup_add_form = {};

        $scope.usergroup_add_form.company_list = [];
        $scope.usergroup_add_form.company_list = angular.copy($scope.company_list);

        $scope.usergroup_add_form.company_list.forEach(function(company, index) {
            $scope.usergroup_add_form.company_list[index].modules = {};
            $scope.usergroup_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
        });
        // console.log($scope.usergroup_add_form);
    };

    $scope.openCreateGroupModal = function() {
        $("#CreateUserGroupModal").modal("show");
        $scope.initCreateUserGroupData();
    };

    $scope.usergroup_delete_form = {};
    $scope.initDeleteUserGroupData = function() {
        $scope.usergroup_delete_form.smusergroup_list = [];
        $scope.usergroup_delete_form.smusergroup_list = $scope.smusergroup_list;
    };

    $scope.openDeleteGroupModal = function() {
        $("#DeleteUserGroupModal").modal("show");
        $scope.initDeleteUserGroupData();
    };

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

    $scope.initCreateUserData = function() {

        $scope.user_add_form = {};
        $scope.user_add_form.name = "ea";
        $scope.user_add_form.username = "eauser";
        $scope.user_add_form.password = "password";
        // $scope.user_add_form.company_list = [];
        // $scope.user_add_form.company_list = angular.copy($scope.company_list);
        $scope.user_add_form.usergroup_list = [];
        $scope.user_add_form.usergroup_list = angular.copy($scope.smusergroup_list);
        // console.log($scope.user_add_form.usergroup_list);

        // $scope.user_add_form.company_list.forEach(function(company, index) {
        //     $scope.user_add_form.company_list[index].modules = {};
        //     $scope.user_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
        // });
    };

    $scope.openCreateUserModal = function() {
        $("#CreateUserModal").modal("show");
        $scope.initCreateUserData();
    };

    $scope.openEditGroupModal = function () {
        $("#EditUserGroupModal").modal("show");
        // GenericFactory.get($scope.company_id).then(function (response) {
        //     if (response.status) {
        //         console.log(response.results);
        //         $scope.edit_group_list = response.results
        //         //  $scope.edit_selected_group = 0;
        //     }
        // });
    };

    // $scope.submitEditGroup = function () {
    //     // console.log($scope.edit_selected_group);
    //     // console.log($scope.edit_group_list);
    //     var selected_group_index = $scope.edit_selected_group;
    //     console.log(selected_group_index);
    //     // console.log(selected_group_index);
    //     var payload = $scope.edit_group_list[selected_group_index];
    //     //
    //     console.log(payload);
    //     GenericFactory.update(payload.id, payload).then(function (response) {
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
    //     GenericFactory.get($scope.company_id).then(function (response) {
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
    //             GenericFactory.delete(current_group.id).then(function (response) {
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
