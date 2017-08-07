app.controller('CreateUserGroupController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", function($scope, $rootScope, $state, GenericFactory, $q) {

    // $scope.selected_company = {};
    // $scope.initCreateUserGroupData = function() {
    //
    //     $scope.usergroup_add_form = {};
    //     $scope.usergroup_add_form.company_list = {};
    //     $scope.usergroup_add_form.company_list = angular.copy($scope.company_list);
    //
    //     $scope.usergroup_add_form.company_list.forEach(function(company, index) {
    //         $scope.usergroup_add_form.company_list[index].modules = {};
    //         $scope.usergroup_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
    //     });
    // };
    // $scope.initCreateUserGroupData();

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

    $scope.submitAddGroup = function() {

        var group_payload = angular.copy($scope.usergroup_add_form);
        var company_list_payload = group_payload.company_list;
        delete group_payload.company_list;

        GenericFactory.post("smusergroup", group_payload).then(function(response) {
            if (response.status) {

                var prom_list = [];
                company_list_payload.forEach(function(company) {
                    company.modules.forEach(function(module) {
                        if (module.selected) {
                            var payload = {};
                            payload.smusergroup = {};
                            payload.smmodules = {};
                            payload.smcompany = {};
                            payload.smusergroup.id = response.id;
                            payload.smmodules.id = module.id;
                            payload.smcompany.id = company.id;

                            prom_list.push(GenericFactory.post("smusergrouphassmmodules", payload));
                        }
                    });
                });

                $q.all(prom_list).then(function(response) {
                    // $scope.initCreateUserGroupData();
                    // $scope.usergroup_add_form = {};
                    // $scope.usergroup_add_form.company_list = [];
                    // console.log($scope.usergroup_add_form);

                    $scope.loadUserGroups();
                    swal({
                        title: "Success!",
                        text: "Group added successfully",
                        type: "success"
                    });
                    $("#CreateUserGroupModal").modal("hide");
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
