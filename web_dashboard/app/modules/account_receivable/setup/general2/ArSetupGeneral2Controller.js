app.controller('ArSetupGeneral2Controller', ["$scope", "$rootScope", "GenericFactory", "$state", "$timeout", function($scope, $rootScope, GenericFactory, $state, $timeout) {
    // Browser title
    $rootScope.page_title = "Setup General #2";

    $('[ui-sref="ar_setup_general_2"]').toggleClass("ar-menu-active");
    $('[ui-sref="ar_setup_general_1"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_finance_charge"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_gl_accounts"]').removeClass("ar-menu-active");

    $scope.arsyst = {};

    $scope.arpycd_list = [];
    $scope.arwhse_list = [];
    $scope.arrevn_list = [];

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    var arpycd_prom = GenericFactory.get("arpycd", "limit/-1", custom_headers);
    var arwhse_prom = GenericFactory.get("arwhse", "limit/-1", custom_headers);
    var arrevn_prom = GenericFactory.get("arrevn", "limit/-1", custom_headers);
    var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

    arpycd_prom.then(function(response) {
        if (response.status) {
            $scope.arpycd_list = response.results;
        }

        return arwhse_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.arwhse_list = response.results;
        }

        return arrevn_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.arrevn_list = response.results;
        }

        return arsyst_prom;
    }).then(function(response) {
        $scope.arsyst = response.results[0];
    });

    $scope.updateArsystSettingsGeneral2 = function() {

        var payload = $scope.arsyst;
        if (payload.arpycd) {
            payload.arpycd_id = payload.arpycd.id;
        }
        if (payload.arwhse) {
            payload.arwhse_id = payload.arwhse.id;
        }
        if (payload.arrevn) {
            payload.arrevn_id = payload.arrevn.id;
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

    $("#pay_code").select2();
    $("#warehouse").select2();
    $("#revenue_code").select2();
}]);
