app.controller('CurrencyCodeController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Currency Code";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.currency = {};

    $scope.current_nlxchgrate = "";
    $scope.current_dlxchgrate = "";

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.currency_list = [];
    $scope.loadCurrencyList = function() {
        GenericFactory.get("cocurr", "", custom_headers).then(function(response) {
            $scope.currency_list = response.results;
        });
    };
    $scope.loadCurrencyList();

    $scope.saveCurrency = function() {
        GenericFactory.post("cocurr", $scope.currency, custom_headers).then(function(response) {
            if (response.status) {
                Alertify.success("Currency: {0} has been added successfully".format(
                    $scope.currency.ccurrcode
                ));

                $scope.clearCurrencyForm();
                $scope.loadCurrencyList();
            } else {
                Alertify.success("Error adding {0}".format(
                    $scope.currency.ccurrcode
                ));
            }
        });
    };

    $scope.clearCurrencyForm = function() {
        $scope.currency = {};
        $("#exchange_rate_date").val("");
        Alertify.log("Currency form has been cleaned successfully");
    };

    $scope.deleteCurrency = function() {
        var currency_id = $scope.currency.id;
        GenericFactory.delete("cocurr", currency_id, custom_headers).then(function(response) {
            if (response.status) {
                Alertify.success("Currency: {0} has been deleted successfully".format(
                    $scope.currency.ccurrcode
                ));

                $scope.clearCurrencyForm();
                $scope.loadCurrencyList();
            } else {
                Alertify.error("Error deleting {0}".format(
                    $scope.currency.ccurrcode
                ));
            }
        });
    };

    $scope.updateCurrency = function() {

        $scope.currency.dxchgrate = $("#exchange_rate_date").val();
        $scope.currency.nlxchgrate = $scope.current_nlxchgrate;
        $scope.currency.dlxchgrate = $scope.current_dlxchgrate;

        GenericFactory.put("cocurr", $scope.currency, custom_headers).then(function(response) {
            if (response.status) {
                Alertify.success("Currency: {0} has been updated successfully".format(
                    $scope.currency.ccurrcode
                ));

                $scope.clearCurrencyForm();
                $scope.loadCurrencyList();
            } else {
                Alertify.error("Error updating {0}".format(
                    $scope.currency.ccurrcode
                ));
            }
        });
    };

    $scope.openCurrencyCodeModal = function() {
        $("#selectCurrencyCodeModal").modal("show");
    };

    $scope.selectCurrencyCode = function(ccode) {
        $scope.currency = ccode;

        $scope.current_nlxchgrate = ccode.nxchgrate;
        $scope.current_dlxchgrate = ccode.dxchgrate;

        Alertify.log("Currency form has been loaded successfully");
        $("#selectCurrencyCodeModal").modal("hide");
    };

    new Formatter(document.getElementById('exchange_rate_date'), {
        'pattern': '{{99}}/{{99}}/{{9999}}',
        'persistent': true
    });

    new Formatter(document.getElementById('last_exchange_rate_date'), {
        'pattern': '{{99}}/{{99}}/{{9999}}',
        'persistent': true
    });

}]);
