app.controller('ArSetupGeneral1Controller', ["$scope", "$rootScope", "GenericFactory", "$state", "$timeout", function($scope, $rootScope, GenericFactory, $state, $timeout) {
    // Browser title
    $rootScope.page_title = "Setup General #1";

    // blue shadow
    $('[ui-sref="ar_setup_general_1"]').toggleClass("ar-menu-active");
    $('[ui-sref="ar_setup_general_2"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_finance_charge"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
    $('[ui-sref="ar_setup_gl_accounts"]').removeClass("ar-menu-active");

    $scope.arsyst = {};

    $scope.arfrgt_list = [];
    $scope.arfob_list = [];

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    var arfrgt_prom = GenericFactory.get("arfrgt", "limit/-1", custom_headers);
    var arfob_prom = GenericFactory.get("arfob", "limit/-1", custom_headers);
    var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

    arfrgt_prom.then(function(response) {
        if (response.status) {
            $scope.arfrgt_list = response.results;
        }

        return arfob_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.arfob_list = response.results;
        }

        return arsyst_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.arsyst = response.results[0];
        }
    });

    $scope.updateArsystSettingsGeneral1 = function() {

        var payload = $scope.arsyst;
        if (payload.arfob) {
            payload.arfob_id = payload.arfob.id;
        }
        if (payload.arfrgt) {
            payload.arfrgt_id = payload.arfrgt.id;
        }

        delete payload.arfob;
        delete payload.arfrgt;
        delete payload.arpycd;
        delete payload.arwhse;
        delete payload.arrevn;

        payload.start_range = document.getElementById("start_range").value;
        payload.end_range = document.getElementById("end_range").value;
        payload.purge_invoices_dates = document.getElementById("purge_invoices_dates").value;
        payload.purge_payments_dates = document.getElementById("purge_payments_dates").value;

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
    $('#ship_via').select2();
    $('#fob').select2();

    $('#purge_invoices_dates').formatter({
        'pattern': '{{99}}/{{99}}/{{9999}}',
        'persistent': true
    });
    $('#purge_payments_dates').formatter({
        'pattern': '{{99}}/{{99}}/{{9999}}',
        'persistent': true
    });
    $('#start_range').formatter({
        'pattern': '{{99}}/{{99}}/{{9999}}',
        'persistent': true
    });
    $('#end_range').formatter({
        'pattern': '{{99}}/{{99}}/{{9999}}',
        'persistent': true
    });

}]);
