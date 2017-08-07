app.controller('SalestaxController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Salex tax";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.salestax = {};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.salestax_list = [];
    $scope.loadSalestaxList = function() {
        GenericFactory.get("costax", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.salestax_list = response.results;
            }
        });
    };
    $scope.loadSalestaxList();

    $scope.currency_list = [];
    $scope.loadCurrencyList = function() {
        GenericFactory.get("cocurr", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.currency_list = response.results;
            }
        });
    };
    $scope.loadCurrencyList();

    $scope.tax_account_list = [];
    $scope.loadTaxAccountList = function() {
        GenericFactory.get("artaxacc", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.tax_account_list = response.results;
            }
        });
    };
    $scope.loadTaxAccountList();

    $scope.syst_config = {};
    $scope.loadSystConfig = function() {
        GenericFactory.get("arsyst", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.syst_config = response.results[0];
            }
        });
    };
    $scope.loadSystConfig();

    $scope.openSalestaxModal = function() {
        $("#SelectSalestaxModal").modal("show");
    };

    $scope.selectSalestax = function(selected_salestax) {
        $scope.salestax = angular.copy(selected_salestax);

        $("#SelectSalestaxModal").modal("hide");
    };

    $scope.openCurrencyModal = function() {
        $("#SelectCurrencyModal").modal("show");
    };

    $scope.selectCurrency = function(selected_currency) {
        $scope.salestax.currency = selected_currency.ccurrcode;

        $("#SelectCurrencyModal").modal("hide");
    };

    $scope.openTaxAccountModal = function() {
        $("#SelectTaxAccountModal").modal("show");
    };

    $scope.selectTaxAccount = function(selected_tax_account) {
        $scope.salestax.cstaxacc1 = selected_tax_account.id;
        $("#SelectTaxAccountModal").modal("hide");
    };

    $scope.saveSalestax = function() {
        var payload = angular.copy($scope.salestax);

        if (payload.ctaxcode && payload.cdescript && payload.ntaxrate1) {
            GenericFactory.post("costax", payload, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadSalestaxList();
                    $scope.salestax = {};
                    swal({
                        title: "Success!",
                        text: "You have added a new salestax",
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
                text: "Please, at least fill the tax code, description & entity1 fields",
                type: "error"
            });
        }

    };

    $scope.deleteSalestax = function() {

        GenericFactory.delete("costax", $scope.salestax.id, custom_headers).then(function(response) {
            if (response.status) {
                $scope.loadSalestaxList();
                $scope.salestax = {};
                swal({
                    title: "Success!",
                    text: "You have deleted the salestax",
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

    $scope.updateSalestax = function() {
        var payload = angular.copy($scope.salestax);
        GenericFactory.put("costax", payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.loadSalestaxList();
                $scope.salestax = {};
                swal({
                    title: "Success!",
                    text: "You have updated the salestax",
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

    $scope.clearSalestaxForm = function() {
        $scope.salestax = {};
        Alertify.log("Salestax form has been cleaned successfully");
    };

}]);
