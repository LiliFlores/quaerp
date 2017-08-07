app.controller('ArSetupFinanceChargeController', ["$scope", "$rootScope", "GenericFactory", "$state", function($scope, $rootScope, GenericFactory, $state) {
    // Browser title
    $rootScope.page_title = "Setup Finance Charge";

    $('[ui-sref="ar_setup_finance_charge"]').toggleClass("ar-menu-active");
    $('[ui-sref="ar_setup_general_1"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_general_2"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_gl_accounts"]').removeClass("ar-menu-active");

    $scope.arsyst = {};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

    arsyst_prom.then(function(response) {
        $scope.arsyst = response.results[0];
    });

    $scope.updateArsystSettingsFinanceCharge = function() {

        var payload = $scope.arsyst;

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

}]);
