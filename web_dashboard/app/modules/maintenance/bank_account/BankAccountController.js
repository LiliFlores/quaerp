app.controller('BankAccountController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Bank Account";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.bank_account = {};
    // $scope.bank_account = {"cbankname":"bname","cdescript":"des","cbankacc":"321321654","cbankroute":"231123312","cglacc":"1001","ccurrcode":"USD","caccttype":"C"};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.$watch("bank_account", function() {
        console.log($scope.bank_account);
    }, 1);

    $scope.bank_list = [];
    $scope.loadBankAccountList = function() {
        GenericFactory.get("cobank", "limit/-1", custom_headers).then(function(response) {
            if (response.status) {
                $scope.bank_list = response.results;
            }
        });
    };
    $scope.loadBankAccountList();

    $scope.glaccount_list = [];
    $scope.loadGLAccountList = function() {
        GenericFactory.get("glaccounts", "limit/-1", custom_headers).then(function(response) {
            if (response.status) {
                $scope.glaccount_list = response.results;
            }
        });
    };
    $scope.loadGLAccountList();

    $scope.currency_code_list = [];
    $scope.loadCurrencyCodeList = function() {
        GenericFactory.get("cocurr", "limit/-1", custom_headers).then(function(response) {
            if (response.status) {
                $scope.currency_code_list = response.results;
            }
        });
    };
    $scope.loadCurrencyCodeList();

    $scope.openBankAccountModal = function() {
        $("#SelectBankAccountModal").modal("show");
    };

    $scope.selectBankAccount = function(selected_bank) {
        $scope.bank_account = angular.copy(selected_bank);
        $("#SelectBankAccountModal").modal("hide");
    };

    $scope.openGLAccountsModal = function() {
        $("#SelectGLAccountModal").modal("show");
    };

    $scope.selectGLAccount = function(selected_gl_account) {
        $scope.bank_account.cglacc = selected_gl_account.id;
        $("#SelectGLAccountModal").modal("hide");
    };

    $scope.openCurrencyCodeModal = function() {
        $("#SelectCurrencyCodeModal").modal("show");
    };

    $scope.selectCurrencyCode = function(selected_currency_code) {
        $scope.bank_account.ccurrcode = selected_currency_code.ccurrcode;
        $("#SelectCurrencyCodeModal").modal("hide");
    };

    $scope.saveBankAccount = function() {
        var bank_account_payload = angular.copy($scope.bank_account);

        if (bank_account_payload.cbankname && bank_account_payload.cdescript) {

            GenericFactory.post("cobank", bank_account_payload, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.bank_account = {};

                    $scope.loadBankAccountList();
                    swal({
                        title: "Success!",
                        text: "You have added a new Bank Account",
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

    $scope.deleteBankAccount = function() {

        GenericFactory.delete("cobank", $scope.bank_account.id, custom_headers).then(function(response) {
            if (response.status) {
                $scope.bank_account = {};

                $scope.loadBankAccountList();
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

    $scope.updateBankAccount = function() {
        var bank_payload = angular.copy($scope.bank_account);
        GenericFactory.put("cobank", bank_payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.bank_account = {};

                $scope.loadBankAccountList();
                swal({
                    title: "Success!",
                    text: "You have updated the bank account",
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

    $scope.clearBankAccountForm = function() {
        $scope.bank_account = {};

        Alertify.log("Bank Account form has been cleaned successfully");
    };

}]);
