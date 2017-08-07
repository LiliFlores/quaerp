app.controller('ImportValidInvoicesController', ["$scope", "$rootScope", "$state", "$timeout", function($scope, $rootScope, $state, $timeout) {

    // $scope.selected_invoice_items = [];
    $scope.selectInvoice = function(invoice) {
        console.log(invoice);
        $scope.selected_invoice_items = invoice.items;
    };

}]);
