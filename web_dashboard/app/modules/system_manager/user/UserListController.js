app.controller('UserListController', ["$scope", "$rootScope", "GenericFactory", "$state", "$q", "UserService", function($scope, $rootScope, GenericFactory, $state, $q, UserService) {

    $scope.user_edit_form = {};

    $scope.blockUser = function(user) {
        var payload = {};
        payload.id = user.id;
        payload.active = !(user.active == "1");
        GenericFactory.put("smuser", payload).then(function(response) {
            user.active = payload.active;
            alertify.success("User have succesfully been updated");
        });
    };

    // $scope.submitEditUser = function() {
    //     console.log($scope.user_edit_form);
    // };


    $scope.editUser = function(user) {
        $("#EditUserModal").modal("show");
        // console.log(user);
        $scope.user_edit_form = user;
        console.log($scope);
        // UserService.set(user);
        // $scope.initEditUserData();
        // $scope.user_edit_form = {};
        // console.log($scope.selected_smusergroup);
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

}]);
