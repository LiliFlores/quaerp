app.controller('InventorySetupSettingsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

    $scope.inventory_status_list = [
        {
            "status": "A",
            "description": "Active"
        },
        {
            "status": "I",
            "description": "Inactive"
        }
    ];

    $scope.openRevenueModal = function() {
        $("#SelectRevenueModal").modal("show");
    };

    $scope.selectRevenue = function(selected_revenue) {
        $scope.inventory.crevncode = selected_revenue.crevncode;
        $("#SelectRevenueModal").modal("hide");
    };

    $scope.openPaycodeModal = function() {
        $("#SelectPaycodeModal").modal("show");
    };

    $scope.selectPaycode = function(selected_paycode) {
        $scope.inventory.cpaycode = selected_paycode.cpaycode;
        $("#SelectPaycodeModal").modal("hide");
    };

    $scope.openCurrencyModal = function() {
        $("#SelectCurrencyModal").modal("show");
    };

    $scope.selectCurrency = function(selected_currency) {
        $scope.inventory.ccurrcode = selected_currency.ccurrcode;
        $("#SelectCurrencyModal").modal("hide");
    };

    $scope.addCard = function() {
        $scope.card_list.push({
            id_db: false,
            deleted: false
        });
    };

    $scope.removeCard = function($index) {
        $scope.card_list[$index].deleted = true;
    };

}]);
