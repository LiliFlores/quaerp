app.controller('SalesReturnWithInvoicePaymentController', ["$scope", "$rootScope", "$state", function($scope, $rootScope, $state) {
    $rootScope.enable_print_invoice_preview = true;


    // console.log($scope.invoice);
    // $scope.disable_card_options = true;
    // console.log($scope.arcard_list);

    // $scope.invoice.cbankno = "";

    // $scope.card = {};
    // $scope.invoice_address1 = {};
    // $scope.invoice_address2 = {};
    // $scope.selecting_address_n = 1;
    // $scope.invoice_sales_tax = {};

    // $scope.invoice.order_date = new Date($scope.invoice.order_date);
    // $scope.invoice.invoice_date = new Date($scope.invoice.invoice_date);
    //
    // try {
    //     // if customer.cpaycode is set
    //     typeof($scope.customer.cpaycode);
    //     // console.log($scope.customer);
    //     $scope.setDefaultCompanyBank();
    // } catch (e) {}


    $scope.openPayCodeModal = function() {
        $("#SelectPaycodeModal").modal("show");
    };

    $scope.selectPaycode = function(paycode) {
        $scope.invoice.customer.cpaycode = paycode.cpaycode;
        $scope.invoice.cbankno = paycode.cbankno;
        $("#SelectPaycodeModal").modal("hide");
    };

    $scope.openAddressModal = function(n_address) {
        $scope.selecting_address_n = n_address;
        $("#SelectAddressModal").modal("show");
    };

    $scope.selectAddress = function(address) {
        if ($scope.selecting_address_n == 1) {
            $scope.invoice.address1 = address;
        } else {
            $scope.invoice.address2 = address;
        }
        $("#SelectAddressModal").modal("hide");
    };

    $scope.openTaxModal = function() {
        $("#SelectSaleTaxModal").modal("show");
    };

    $scope.selectTax = function(tax) {
        $scope.invoice.sales_tax = tax;
        $("#SelectSaleTaxModal").modal("hide");
    };

    // $scope.openCardModal = function() {
    //     $("#selectCardModal").modal("show");
    // };
    //
    // $scope.selectCard = function(card) {
    //     $scope.invoice.card = card;
    //     $("#selectCardModal").modal("hide");
    // };
    //
    // $scope.openAddressModal = function(n_address) {
    //     $scope.selecting_address_n = n_address;
    //     $("#selectAddressModal").modal("show");
    // };
    //
    // $scope.selectAddress = function(address) {
    //     if ($scope.selecting_address_n == 1) {
    //         $scope.invoice.address1 = address;
    //     } else {
    //         $scope.invoice.address2 = address;
    //     }
    //     $("#selectAddressModal").modal("hide");
    // };
    //


}]);
