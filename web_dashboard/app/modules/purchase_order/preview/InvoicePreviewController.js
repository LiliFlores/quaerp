app.controller('InvoicePreviewController', ["$scope", "$rootScope", "$state", function($scope, $rootScope, $state) {

    $rootScope.enable_print_invoice_preview = false;
    // var t1 = new Date($scope.invoice.order_date);
    // var t2 = new Date($scope.invoice.invoice_date);
    // $scope.invoice.order_date = t1.getFullYear() + "-" + (t1.getMonth() + 1) + "-" + t1.getDate();
    // $scope.invoice.invoice_date = t2.getFullYear() + "-" + (t2.getMonth() + 1) + "-" + t2.getDate();

}]);
