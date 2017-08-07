app.controller('CustomerSetupGLAccountsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

    $scope.openGLAccountModal = function() {
        $("#SelectGLAccountModal").modal("show");
    };

    $scope.selectGLAccount = function(selected_glaccount) {
        $scope.customer.glaccount = selected_glaccount.id;
        $("#SelectGLAccountModal").modal("hide");
    };

}]);
