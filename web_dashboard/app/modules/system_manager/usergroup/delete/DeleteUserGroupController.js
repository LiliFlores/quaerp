app.controller('DeleteUserGroupController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", function($scope, $rootScope, $state, GenericFactory, $q) {

    // $scope.initDeleteUserGroupData = function() {
    //
    //     $scope.usergroup_delete_form = {};
    //     $scope.usergroup_delete_form.smusergroup_list = {};
    //     $scope.usergroup_delete_form.smusergroup_list = angular.copy($scope.smusergroup_list);
    // };
    // $scope.initDeleteUserGroupDa

    $scope.deleteUserGroupsModules = function() {
        GenericFactory.get("smusergrouphassmmodules").then(function(response) {
            if (response.status) {

                response.results.forEach(function(row) {
                    if ($scope.usergroup_delete_form.selected_group.id == row.smusergroup.id) {
                        GenericFactory.delete("smusergrouphassmmodules", row.id);
                    }
                });

            }
        });
    };

    $scope.submitDeleteGroup = function() {
        // console.log($scope.usergroup_delete_form.selected_group);

        $scope.deleteUserGroupsModules();

        let group_id = $scope.usergroup_delete_form.selected_group.id;
        GenericFactory.delete("smusergroup", group_id).then(function(response) {
            console.log(response);
            if (response.status) {
                swal({
                    title: "Good job!",
                    text: "The Group has been deleted successfully!",
                    type: "success",
                    timer: 2000
                });
                delete $scope.usergroup_delete_form.selected_group;
                $scope.loadUserGroups();
                $("#DeleteUserGroupModal").modal("hide");
                // $scope.initDeleteUserGroupData();
            } else {
                console.log("error");
            }
        });
    };

}]);
