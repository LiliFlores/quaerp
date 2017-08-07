app.controller('SalespersonController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Salesperson";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.salesperson = {};
    $scope.salesperson_status_list = [
        {
            "status": "A",
            "description": "Active"
        },
        {
            "status": "I",
            "description": "Inactive"
        }
    ];

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.salesperson_list = [];
    $scope.loadSalespersonList = function() {
        GenericFactory.get("arslpn", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.salesperson_list = response.results;
            }
        });
    };
    $scope.loadSalespersonList();

    $scope.revenue_list = [];
    $scope.loadRevenueList = function() {
        GenericFactory.get("arrevn", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.revenue_list = response.results;
            }
        });
    };
    $scope.loadRevenueList();

    $scope.invoice_list = [];
    $scope.loadInvoiceList = function() {
        GenericFactory.get("arinvoice", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.invoice_list = response.results;
            }
        });
    };
    $scope.loadInvoiceList();

    $scope.openSalespersonModal = function() {
        $("#SelectSalespersonModal").modal("show");
    };

    $scope.selectSalesperson = function(salesperson) {
        $scope.salesperson = angular.copy(salesperson);

        $("#SelectSalespersonModal").modal("hide");
    };

    $scope.openRevenueModal = function() {
        $("#SelectRevenueModal").modal("show");
    };

    $scope.selectRevenue = function(revenue) {
        $scope.salesperson.crevncode = revenue.crevncode;
        $("#SelectRevenueModal").modal("hide");
    };

    $scope.saveSalesperson = function() {
        var payload = angular.copy($scope.salesperson);

        // console.log(payload);
        if (payload.cslpnno && payload.cname && payload.ctitle) {
            GenericFactory.post("arslpn", payload, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadSalespersonList();
                    $scope.salesperson = {};
                    swal({
                        title: "Success!",
                        text: "You have added a new Salesperson",
                        type: "success"
                    });
                } else {
                    console.log(response);
                    swal({
                        title: "Error!",
                        text: "Please, contact admin.",
                        type: "error"
                    });
                }
            });
        } else {
            swal({
                title: "Error!",
                text: "Please, at least fill the NO, Name & Title fields",
                type: "error"
            });
        }

    };

    $scope.deleteSalesperson = function() {

        var salesperson_in_invoice = false;
        var invoice_name_list = [];
        $scope.invoice_list.some(function(invoice) {
            if (invoice.cslpnno == $scope.salesperson.cslpnno) {
                salesperson_in_invoice = true;
                invoice_name_list.push(invoice.cinvno);
                // return 1;
            }
        });

        // console.log(address_in_salesperson);
        // console.log(invoice_name_list);
        // throw new Error();

        if (salesperson_in_invoice) {
            // console.log(invoice_id_list);
            // console.log(invoice_id_list.length);
            var message = "";
            if (invoice_name_list.length == 1) {
                message = "The selected salesperson is already been used in the following invoice: {0}".format(invoice_name_list);
            } else {
                message = "The selected salesperson is already been used in the following invoices: {0}".format(invoice_name_list);
            }
            // console.log(message);
            swal({
                title: "Hold on cowboy!",
                text: message,
                type: "warning"
            });
        } else {
            GenericFactory.delete("arslpn", $scope.salesperson.id, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadSalespersonList();
                    $scope.salesperson = {};
                    swal({
                        title: "Success!",
                        text: "You have deleted the salesperson",
                        type: "success"
                    });
                } else {
                    console.log(response);
                    swal({
                        title: "Error!",
                        text: "Please, contact admin.",
                        type: "error"
                    });
                }
            });
        }
    };

    $scope.updateSalesperson = function() {
        var payload = angular.copy($scope.salesperson);
        GenericFactory.put("arslpn", payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.loadSalespersonList();
                $scope.salesperson = {};
                swal({
                    title: "Success!",
                    text: "You have updated the salesperson",
                    type: "success"
                });
            } else {
                console.log(response);
                swal({
                    title: "Error!",
                    text: "Please, contact admin.",
                    type: "error"
                });
            }
        });
    };

    $scope.clearSalespersonForm = function() {
        $scope.salesperson = {};
        Alertify.log("Salesperson form has been cleaned successfully");
    };

}]);
