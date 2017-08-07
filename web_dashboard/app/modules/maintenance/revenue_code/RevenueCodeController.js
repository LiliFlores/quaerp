app.controller('RevenueCodeController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Revenue Code";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.revenue_code = {};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.$watch("revenue_code", function() {
        if ($scope.glaccount_list) {

            var inputs_to_check = ["crevnacc", "crtrnacc", "cdiscacc", "ccogsacc"];
            for (var i = 0; i < $scope.glaccount_list.length; i++) {
                var account = $scope.glaccount_list[i];
                var status = 0;

                inputs_to_check.forEach(function(input_code) {
                    if ($scope.revenue_code[input_code] == account.id) {
                        $scope[input_code] = account.description;
                        status += 1;
                    }
                });

                if (status == 4) {
                    break;
                }

            }
        }
    }, 1);

    $scope.revenue_code_list = [];
    $scope.loadRevenueCodeList = function() {
        GenericFactory.get("arrevn", "limit/-1", custom_headers).then(function(response) {
            if (response.status) {
                $scope.revenue_code_list = response.results;
            }
        });
    };
    $scope.loadRevenueCodeList();

    $scope.glaccount_list = [];
    $scope.loadGLAccountList = function() {
        GenericFactory.get("glaccounts", "limit/-1", custom_headers).then(function(response) {
            if (response.status) {
                $scope.glaccount_list = response.results;
            }
        });
    };
    $scope.loadGLAccountList();

    $scope.openRevenueCodeModal = function() {
        $("#SelectRevenueCodeModal").modal("show");
    };

    $scope.selectRevenueCode = function(selected_revenue_code) {
        $scope.revenue_code = angular.copy(selected_revenue_code);

        $("#SelectRevenueCodeModal").modal("hide");
    };

    // glacc_input_to_work_with = glaitww
    var glaitww = 0;
    $scope.openGLAccountsModal = function(selected_input) {
        // console.log(selected_input);
        glaitww = selected_input;

        $("#SelectGLAccountModal").modal("show");
    };

    $scope.selectGLAccount = function(selected_gl_account) {

        switch (glaitww) {
            case 0:
                $scope.revenue_code.crevnacc = selected_gl_account.id;
                break;
            case 1:
                $scope.revenue_code.crtrnacc = selected_gl_account.id;
                break;
            case 2:
                $scope.revenue_code.cdiscacc = selected_gl_account.id;
                break;
            case 3:
                $scope.revenue_code.ccogsacc = selected_gl_account.id;
                break;
        }

        $("#SelectGLAccountModal").modal("hide");
    };

    $scope.saveRevenueCode = function() {
        var revenue_code_payload = angular.copy($scope.revenue_code);

        if (revenue_code_payload.crevncode && revenue_code_payload.cdescript) {

            GenericFactory.post("arrevn", revenue_code_payload, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.revenue_code = {};
                    $scope.crevnacc = "";
                    $scope.crtrnacc = "";
                    $scope.cdiscacc = "";
                    $scope.ccogsacc = "";

                    $scope.loadRevenueCodeList();
                    swal({
                        title: "Success!",
                        text: "You have added a new Revenue Code",
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
                text: "Please, at least fill the Code & Description fields",
                type: "error"
            });
        }

    };

    $scope.deleteRevenueCode = function() {

        GenericFactory.delete("arrevn", $scope.revenue_code.id, custom_headers).then(function(response) {
            if (response.status) {
                $scope.revenue_code = {};
                $scope.crevnacc = "";
                $scope.crtrnacc = "";
                $scope.cdiscacc = "";
                $scope.ccogsacc = "";

                $scope.loadRevenueCodeList();
                swal({
                    title: "Success!",
                    text: "You have deleted the revenue code",
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

    $scope.updateRevenueCode = function() {
        var revenue_code_payload = angular.copy($scope.revenue_code);
        GenericFactory.put("arrevn", revenue_code_payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.revenue_code = {};
                $scope.crevnacc = "";
                $scope.crtrnacc = "";
                $scope.cdiscacc = "";
                $scope.ccogsacc = "";

                $scope.loadRevenueCodeList();
                swal({
                    title: "Success!",
                    text: "You have updated the revenue code",
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

    $scope.clearRevenueCodeForm = function() {
        $scope.revenue_code = {};
        $scope.crevnacc = "";
        $scope.crtrnacc = "";
        $scope.cdiscacc = "";
        $scope.ccogsacc = "";

        Alertify.log("Revenue Code form has been cleaned successfully");
    };

}]);
