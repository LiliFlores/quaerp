app.controller('PaycodeController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Paycode";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.paycode = {};
    $scope.paycode_type_list = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.paycode_list = [];
    $scope.loadPaycodeList = function() {
        GenericFactory.get("arpycd", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.paycode_list = response.results;
            }
        });
    };
    $scope.loadPaycodeList();

    $scope.customer_list = [];
    $scope.loadClientList = function() {
        GenericFactory.get("arcust", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.customer_list = response.results;
            }
        });
    };
    $scope.loadClientList();

    $scope.openPaycodeModal = function() {
        $("#SelectPaycodeModal").modal("show");
    };

    $scope.selectPaycode = function(selected_paycode) {
        $scope.paycode = angular.copy(selected_paycode);

        $("#SelectPaycodeModal").modal("hide");
    };

    $scope.savePaycode = function() {
        var payload = angular.copy($scope.paycode);

        if (payload.cpaycode && payload.cdescript) {
            GenericFactory.post("arpycd", payload, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadPaycodeList();
                    $scope.paycode = {};
                    swal({
                        title: "Success!",
                        text: "You have added a new Paycode",
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
                text: "Please, at least fill the paycode NO & description",
                type: "error"
            });
        }

    };

    $scope.deletePaycode = function() {

        var paycode_in_customer = false;
        var customer_name_list = [];
        $scope.customer_list.some(function(customer) {
            if (customer.cpaycode == $scope.paycode.cpaycode) {
                paycode_in_customer = true;
                customer_name_list.push(customer.ccompany);
            }
        });

        if (paycode_in_customer) {
            var message = "";
            if (customer_name_list.length == 1) {
                message = "The selected paycode is already been used in the following customer: {0}".format(customer_name_list);
            } else {
                message = "The selected paycode is already been used in the following customers: {0}".format(customer_name_list);
            }
            // console.log(message);
            swal({
                title: "Hold on cowboy!",
                text: message,
                type: "warning"
            });
        } else {
            GenericFactory.delete("arpycd", $scope.paycode.id, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadPaycodeList();
                    $scope.paycode = {};
                    swal({
                        title: "Success!",
                        text: "You have deleted the paycode",
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

    $scope.updatePaycode = function() {
        var payload = angular.copy($scope.paycode);
        GenericFactory.put("arpycd", payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.loadPaycodeList();
                $scope.paycode = {};
                swal({
                    title: "Success!",
                    text: "You have updated the paycode",
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

    $scope.clearPaycodeForm = function() {
        $scope.paycode = {};
        $scope.paycode.npaytype = '1'
        Alertify.log("Paycode form has been cleaned successfully");
    };

}]);
