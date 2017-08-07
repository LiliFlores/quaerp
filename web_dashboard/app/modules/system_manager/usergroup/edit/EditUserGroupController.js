app.controller('EditUserGroupController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", "$timeout", function($scope, $rootScope, $state, GenericFactory, $q, $timeout) {

    //
    // $timeout(function() {
    //     $("#EditUserGroupModal").modal("show");
    // }, 1000);

    var usergroupmodules_list = [];
    $scope.initEditUserGroupData = function() {
        $scope.usergroup_edit_form = {};

        $scope.selected_company = {};

        $scope.usergroup_edit_form = angular.copy($scope.edit_selected_smusergroup);
        $scope.usergroup_edit_form.company_list = angular.copy($scope.company_list);
        $scope.usergroup_edit_form.company_list.forEach(function(company, index) {
            $scope.usergroup_edit_form.company_list[index].modules = {};
            $scope.usergroup_edit_form.company_list[index].modules = angular.copy($scope.smmodules_list);
        });
    };

    $scope.selectUserGroup = function() {
        $scope.initEditUserGroupData();
        $scope.loadUserGroupsModules();
    };

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
        GenericFactory.get("smusergrouphassmmodules").then(function(response) {
            if (response.status) {
                // usergroupmodules_list = [];

                response.results.forEach(function(row) {
                    // console.log(row);
                    $scope.usergroup_edit_form.company_list.forEach(function(company) {
                        if (company.id == row.smcompany.id && $scope.edit_selected_smusergroup.id == row.smusergroup.id) {
                            usergroupmodules_list.push(row);
                            console.log(row);

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

    $scope.submitEditGroup = function() {

        var group_payload = angular.copy($scope.usergroup_edit_form);
        var company_list_payload = group_payload.company_list;
        delete group_payload.company_list;

        // console.log(usergroupmodules_list);
        //
        // throw new Error();
        GenericFactory.put("smusergroup", group_payload).then(function(response) {
            if (response.status) {
                let delete_prom = [];
                usergroupmodules_list.forEach(function(module_to_delete) {
                    delete_prom.push(GenericFactory.delete("smusergrouphassmmodules", module_to_delete.id));
                });

                $q.all(delete_prom).then(function(response) {

                    var prom_list = [];
                    company_list_payload.forEach(function(company) {
                        company.modules.forEach(function(module) {
                            if (module.selected) {
                                var payload = {};
                                payload.smusergroup = {};
                                payload.smmodules = {};
                                payload.smcompany = {};
                                payload.smusergroup.id = group_payload.id;
                                payload.smmodules.id = module.id;
                                payload.smcompany.id = company.id;

                                prom_list.push(GenericFactory.post("smusergrouphassmmodules", payload));
                            }
                        });
                    });

                    $q.all(prom_list).then(function(response) {
                        $scope.loadUserGroups();

                        swal({
                            title: "Success!",
                            text: "Group added successfully",
                            type: "success"
                        });

                        $("#EditUserGroupModal").modal("hide");
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
