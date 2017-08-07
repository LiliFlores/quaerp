app.controller('CustomerSetupInformationController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

    $scope.openWarehouseModal = function() {
        $("#SelectWarehouseModal").modal("show");
    };

    $scope.selectWarehouse = function(selected_warehouse) {
        $scope.customer.cwarehouse = selected_warehouse.cwarehouse;
        $("#SelectWarehouseModal").modal("hide");
    };

    $scope.openAddressModal = function(address_type) {
        $scope.address_type = address_type;
        $("#SelectAddressModal").modal("show");
    };

    $scope.selectAddress = function(selected_address) {
        if ($scope.address_type == "bill") {
            $scope.customer.cbilltono = selected_address.caddrno;
        } else {
            $scope.customer.cshiptono = selected_address.caddrno;
        }
        $("#SelectAddressModal").modal("hide");
    };

    $scope.openSalesTaxModal = function() {
        $("#SelectSalesTaxModal").modal("show");
    };

    $scope.selectSalesTax = function(selected_salestax) {
        $scope.customer.ctaxcode = selected_salestax.ctaxcode;
        $("#SelectSalesTaxModal").modal("hide");
    };

    $scope.openSalespersonModal = function(selected_salesperson) {
        $("#SelectSalespersonModal").modal("show");
    };

    $scope.selectSalesperson = function(selected_salesperson) {
        $scope.customer.cslpnno = selected_salesperson.cslpnno;
        $("#SelectSalespersonModal").modal("hide");
    };

}]);
