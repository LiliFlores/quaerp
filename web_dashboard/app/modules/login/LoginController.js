app.controller('LoginController', ["$scope", "$rootScope", "GenericFactory", "$state", function($scope, $rootScope, GenericFactory, $state) {
    // Browser title
    $rootScope.page_title = "Login";

    $scope.show_login_message = false;
    $scope.login_error_message = "";

    localStorage.removeItem("token");

    $scope.user = {};

    // Default values (TESTING)
    $scope.user.username = "ealvarez";
    $scope.user.password = "password";


    $scope.submit = function() {

        var payload = {
            "username": $scope.user.username,
            "password": $scope.user.password
        };

        GenericFactory.post("login", payload).then(function (response) {

            if (response.status) {
                localStorage.setItem("token", response.token);
                swal({
                    title: "Cool!",
                    text: "Welcome to QUAERP Dashboard",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2500
                });
                $state.go("dashboard");
            } else {
                swal("Not cool!", "wrong credentials!", "error");
            }
        });

    };

}]);
