app.controller('SalesReturnWithInvoiceInformationController', ["$scope", "$rootScope", function($scope, $rootScope) {
    $rootScope.enable_print_invoice_preview = true;


    $scope.openSalesPersonModal = function() {
        $("#SelectSalesPersonModal").modal("show");
    };

    $scope.selectSalesPerson = function(salesperson) {
        $scope.invoice.salesperson = salesperson;
        $("#SelectSalesPersonModal").modal("hide");
    };

    $scope.openRemarkModal = function() {
        $("#SelectRemarkModal").modal("show");
    };

    $scope.selectRemark = function(remark) {
        $scope.invoice.remark = remark;
        $("#SelectRemarkModal").modal("hide");
    };

    // Plugins
    $("#ship_via_select").select2();
    $("#fob_select").select2();
    $("#warehouse_select").select2();
    $("#remark_select").select2();


    // $('#invoice_order_date').formatter({
    //     'pattern': '{{99}}/{{99}}/{{9999}}',
    //     'persistent': true
    // });
    // $('#invoice_invoice_date').formatter({
    //     'pattern': '{{99}}/{{99}}/{{9999}}',
    //     'persistent': true
    // });

}]);
