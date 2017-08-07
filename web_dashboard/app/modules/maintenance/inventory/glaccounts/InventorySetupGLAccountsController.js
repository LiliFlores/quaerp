app.controller('InventorySetupGLAccountsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

    $scope.openGLAccountModal = function() {
        $("#SelectGLAccountModal").modal("show");
    };

    $scope.selectGLAccount = function(selected_glaccount) {
        $scope.inventory.glaccount = selected_glaccount.id;
        $("#SelectGLAccountModal").modal("hide");
    };

}]);
