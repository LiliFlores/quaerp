app.controller('CreateUserController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", function($scope, $rootScope, $state, GenericFactory, $q) {

    $scope.selected_company = {};
    $scope.selectCompany = function(company) {
        $scope.selected_company = company;
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

    $scope.loadUserGroupsModules = function() {

        $scope.user_add_form.company_list = [];
        $scope.user_add_form.company_list = angular.copy($scope.company_list);
        $scope.user_add_form.company_list.forEach(function(company, index) {
            $scope.user_add_form.company_list[index].modules = [];
            $scope.user_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
        });

        $scope.selected_company = {};

        GenericFactory.get("smusergrouphassmmodules").then(function(response) {
            if (response.status) {

                response.results.forEach(function(row) {
                    $scope.user_add_form.company_list.forEach(function(company) {
                        if (company.id == row.smcompany.id && $scope.user_add_form.selected_group.id == row.smusergroup.id) {

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

    $scope.submitCreateUser = function() {

        var user_payload = angular.copy($scope.user_add_form);
        user_payload.active = 1;
        user_payload.master = 0;
        var modules_payload = angular.copy($scope.user_add_form);

        delete user_payload.company_list;
        delete user_payload.usergroup_list;
        delete user_payload.selected_group;

        GenericFactory.post("smuser", user_payload).then(function(response) {
            if (response.status) {

                var prom_list = [];
                var group_has_user_payload = {};
                group_has_user_payload.smusergroup = {};
                group_has_user_payload.smusergroup.id = modules_payload.selected_group.id;
                group_has_user_payload.smuser = {};
                group_has_user_payload.smuser.id = response.id;

                prom_list.push(GenericFactory.post("smusergrouphassmuser", group_has_user_payload));

                modules_payload.company_list.forEach(function(company) {
                    company.modules.forEach(function(module) {
                        if (module.selected) {
                            var payload = {};
                            payload.smusergroup = {};
                            payload.smusergroup.id = modules_payload.selected_group.id;
                            payload.smcompany = {};
                            payload.smcompany.id = company.id;
                            payload.smmodules = {};
                            payload.smmodules.id = module.id;
                            payload.smuser = {};
                            payload.smuser.id = response.id;

                            prom_list.push(GenericFactory.post("smuserhassmmodules", payload));
                        }
                    });
                });

                $q.all(prom_list).then(function(response) {
                    $scope.selected_company = {};

                    $scope.smusergroup_list = [];
                    $scope.user_list_to_show = [];
                    $scope.loadUserGroups();

                    $("#CreateUserModal").modal("hide");
                    swal({
                        title: "Success!",
                        text: "User added successfully",
                        type: "success"
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

}]);
