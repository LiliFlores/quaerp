app.controller('SalesReturnWithInvoiceLineItemsController', ["$scope", "$rootScope", "$state", "$timeout", "GenericFactory", function($scope, $rootScope, $state, $timeout, GenericFactory) {

    $rootScope.enable_print_invoice_preview = true;

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.current_item_to_search = {};

    // Object to show extra info
    $scope.selected_item = {};

    $scope.addEmptyItem = function() {
        $scope.invoice.items.push({
            "discount": 0,
            "shipqty": 1
        });
    };

    $scope.searchStockItem = function(table_row_item) {

        let item_found = false;
        $scope.item_list.forEach(function(item) {
            if (item.citemno == table_row_item.citemno) {
                table_row_item = Object.assign(table_row_item, item);
                item_found = true;
                return;
            }
        });

        if (!item_found) {
            swal({
                title: "Item not found",
                text: "Want to proceed searching in item table list?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, lets search!",
                closeOnConfirm: true
            }, function() {
                $scope.current_item_to_search = table_row_item;
                $("#AddItemModal").modal("show");
            });
        }

    };

    $scope.addItemToList = function(stock_item) {
        $scope.current_item_to_search = Object.assign($scope.current_item_to_search, stock_item);
        $("#AddItemModal").modal("hide");
    };

    $scope.showItemInfo = function(item) {
        $scope.selected_item = item;
    };

    $scope.removeItem = function($index) {

        $scope.invoice.items[$index].deleted = true;
        // if (selected_item.to_update) {
        //     swal({
        //             title: "Are you sure?",
        //             text: "You will not be able to recover this item!",
        //             type: "warning",
        //             showCancelButton: true,
        //             confirmButtonColor: "#DD6B55",
        //             confirmButtonText: "Yes, delete it!",
        //             closeOnConfirm: true
        //         },
        //         function() {
        //             GenericFactory.delete("aritrs", selected_item.id, custom_headers).then(function(response) {
        //                 if (response.status) {
        //                     $scope.invoice.items.splice($index, 1);
        //                     alertify.success("Item deleted");
        //                 } else {
        //                     alertify.error("Please, contact admin");
        //                 }
        //             })
        //
        //         });
        // } else {
        //     $scope.invoice.items.splice($index, 1);
        // }

    };

}]);
