app.controller('RemarkController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Remark";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.remark = {};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.remark_list = [];
    $scope.loadRemarkList = function() {
        GenericFactory.get("arirmk", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.remark_list = response.results;
            }
        });
    };
    $scope.loadRemarkList();

    $scope.invoice_list = [];
    $scope.loadInvoiceList = function() {
        GenericFactory.get("arinvoice", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.invoice_list = response.results;
            }
        });
    };
    $scope.loadInvoiceList();

    $scope.openRemarkModal = function() {
        $("#SelectRemarkModal").modal("show");
    };

    $scope.selectRemark = function(remark) {
        $scope.remark = angular.copy(remark);
        $("#SelectRemarkModal").modal("hide");
    };

    $scope.saveRemark = function() {
        var payload = angular.copy($scope.remark);

        if (payload.code && payload.remarks) {
            GenericFactory.post("arirmk", payload, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadRemarkList();
                    $scope.remark = {};
                    swal({
                        title: "Success!",
                        text: "You have added a new Remark",
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
                text: "Please, fill the form.",
                type: "error"
            });
        }

    };

    $scope.deleteRemark = function() {

        var remark_in_invoice = false;
        var invoice_id_list = [];
        $scope.invoice_list.some(function(invoice) {
            if (invoice.remark == $scope.remark.code) {
                remark_in_invoice = true;
                invoice_id_list.push(invoice.cinvno);
                // return 1;
            }
        });

        if (remark_in_invoice) {
            // console.log(invoice_id_list);
            // console.log(invoice_id_list.length);
            var message = "";
            if (invoice_id_list.length == 1) {
                message = "The selected remark is already been used in the following invoice: {0}".format(invoice_id_list);
            } else {
                message = "The selected remark is already been used in the following invoices: {0}".format(invoice_id_list);
            }
            // console.log(message);
            swal({
                title: "Hold on cowboy!",
                text: message,
                type: "warning"
            });
        } else {
            GenericFactory.delete("arirmk", $scope.remark.id, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadRemarkList();
                    $scope.remark = {};
                    swal({
                        title: "Success!",
                        text: "You have deleted the remark",
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

    $scope.updateRemark = function() {
        var payload = angular.copy($scope.remark);
        GenericFactory.put("arirmk", payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.loadRemarkList();
                $scope.remark = {};
                swal({
                    title: "Success!",
                    text: "You have updated the remark",
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

    $scope.clearRemarkForm = function() {
        $scope.remark = {};
        Alertify.log("Remark form has been cleaned successfully");
    };


}]);
