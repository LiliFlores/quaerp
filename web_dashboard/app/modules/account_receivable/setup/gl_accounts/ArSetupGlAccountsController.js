app.controller('ArSetupGlAccountsController', ["$scope", "$rootScope", "GenericFactory", "$state", "$timeout", function($scope, $rootScope, GenericFactory, $state, $timeout) {
    // Browser title
    $rootScope.page_title = "Setup GL Accounts";

    $('[ui-sref="ar_setup_gl_accounts"]').toggleClass("ar-menu-active");
    $('[ui-sref="ar_setup_general_1"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_general_2"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_finance_charge"]').removeClass("ar-menu-active");

    $scope.arsyst = {};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.glaccounts_list = [];

    var glaccounts_prom = GenericFactory.get("glaccounts", "limit/-1", custom_headers);
    var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

    glaccounts_prom.then(function(response) {
        if (response.status) {
            $scope.glaccounts_list = response.results;
        }

        return arsyst_prom;
    }).then(function(response) {
        $scope.arsyst = response.results[0];

        $scope.glaccounts_list.forEach(function (gl_account, index) {

            if (gl_account.id == $scope.arsyst.account_receivables) {
                $scope.arsyst.account_receivables = gl_account;
            }
            if (gl_account.id == $scope.arsyst.inventory_stock) {
                $scope.arsyst.inventory_stock = gl_account;
            }
            if (gl_account.id == $scope.arsyst.inventory_non_stock) {
                $scope.arsyst.inventory_non_stock = gl_account;
            }
            if (gl_account.id == $scope.arsyst.customer_deposits) {
                $scope.arsyst.customer_deposits = gl_account;
            }
            if (gl_account.id == $scope.arsyst.open_credit_refunds) {
                $scope.arsyst.open_credit_refunds = gl_account;
            }
            if (gl_account.id == $scope.arsyst.sales_taxes_payables) {
                $scope.arsyst.sales_taxes_payables = gl_account;
            }
            if (gl_account.id == $scope.arsyst.invoice_adjustaments) {
                $scope.arsyst.invoice_adjustaments = gl_account;
            }
            if (gl_account.id == $scope.arsyst.freight_revenue) {
                $scope.arsyst.freight_revenue = gl_account;
            }
            if (gl_account.id == $scope.arsyst.interest_income) {
                $scope.arsyst.interest_income = gl_account;
            }
            if (gl_account.id == $scope.arsyst.cost_of_variances) {
                $scope.arsyst.cost_of_variances = gl_account;
            }
            if (gl_account.id == $scope.arsyst.inventory_adjustements) {
                $scope.arsyst.inventory_adjustements = gl_account;
            }
            if (gl_account.id == $scope.arsyst.payment_term_discount) {
                $scope.arsyst.payment_term_discount = gl_account;
            }
            if (gl_account.id == $scope.arsyst.payment_adjustements) {
                $scope.arsyst.payment_adjustements = gl_account;
            }
            if (gl_account.id == $scope.arsyst.bad_deb_expense) {
                $scope.arsyst.bad_deb_expense = gl_account;
            }

        });
    });

    $scope.updateArsystSettingsGlAccounts = function() {

        var payload = $scope.arsyst;

        if (payload.account_receivables) {
            payload.account_receivables = payload.account_receivables.id;
        }
        if (payload.inventory_stock) {
            payload.inventory_stock = payload.inventory_stock.id;
        }
        if (payload.inventory_non_stock) {
            payload.inventory_non_stock = payload.inventory_non_stock.id;
        }
        if (payload.customer_deposits) {
            payload.customer_deposits = payload.customer_deposits.id;
        }
        if (payload.open_credit_refunds) {
            payload.open_credit_refunds = payload.open_credit_refunds.id;
        }
        if (payload.sales_taxes_payables) {
            payload.sales_taxes_payables = payload.sales_taxes_payables.id;
        }
        if (payload.invoice_adjustaments) {
            payload.invoice_adjustaments = payload.invoice_adjustaments.id;
        }
        if (payload.freight_revenue) {
            payload.freight_revenue = payload.freight_revenue.id;
        }
        if (payload.interest_income) {
            payload.interest_income = payload.interest_income.id;
        }
        if (payload.cost_of_variances) {
            payload.cost_of_variances = payload.cost_of_variances.id;
        }
        if (payload.inventory_adjustements) {
            payload.inventory_adjustements = payload.inventory_adjustements.id;
        }
        if (payload.payment_term_discount) {
            payload.payment_term_discount = payload.payment_term_discount.id;
        }
        if (payload.payment_adjustements) {
            payload.payment_adjustements = payload.payment_adjustements.id;
        }
        if (payload.bad_deb_expense) {
            payload.bad_deb_expense = payload.bad_deb_expense.id;
        }

        delete payload.arfob;
        delete payload.arfrgt;
        delete payload.arpycd;
        delete payload.arwhse;
        delete payload.arrevn;

        GenericFactory.put("arsyst", payload, custom_headers).then(function(response) {
            if (response.status) {
                alertify.success("Settings have succesfully been updated");
            } else {
                alertify.error("Error, please contact admin");
                console.log(response);
            }
        });
    };


    // Plugin
    $("#account_receivables").select2();
    $("#inventory_stock").select2();
    $("#inventory_non_stock").select2();
    $("#customer_deposits").select2();
    $("#open_credit_refunds").select2();
    $("#sales_taxes_payables").select2();
    $("#invoice_adjustaments").select2();
    $("#freight_revenue").select2();
    $("#interest_income").select2();
    $("#cost_of_variances").select2();
    $("#inventory_adjustements").select2();
    $("#payment_term_discount").select2();
    $("#payment_adjustements").select2();
    $("#bad_deb_expense").select2();

}]);
