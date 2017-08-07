app.controller('FreightController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "Freight";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.freight = {};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.freight_list = [];
    $scope.loadFreightList = function() {
        GenericFactory.get("arfrgt", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.freight_list = response.results;
            }
        });
    };
    $scope.loadFreightList();

    $scope.syst_config = {};
    $scope.loadSystConfig = function() {
        GenericFactory.get("arsyst", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.syst_config = response.results[0];
            }
        });
    };
    $scope.loadSystConfig();

    $scope.openFreightModal = function() {
        $("#SelectFreightModal").modal("show");
    };

    $scope.selectFreight = function(selected_freight) {
        $scope.freight = angular.copy(selected_freight);

        $("#SelectFreightModal").modal("hide");
    };

    $scope.saveFreight = function() {
        var payload = angular.copy($scope.freight);

        if (payload.description && payload.trevacc) {
            GenericFactory.post("arfrgt", payload, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadFreightList();
                    $scope.freight = {};
                    swal({
                        title: "Success!",
                        text: "You have added a new freight",
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
                text: "Please, at least fill the freight NO & description",
                type: "error"
            });
        }

    };

    $scope.deleteFreight = function() {

        var freight_in_syst_config = false;
        if ($scope.syst_config.arfrgt.id == $scope.freight.id) {
            freight_in_syst_config = true;
        }

        if (freight_in_syst_config) {
            var message = "";

            message = "The selected freight is already been used in the system confguration";

            swal({
                title: "Hold on cowboy!",
                text: message,
                type: "warning"
            });
        } else {
            GenericFactory.delete("arfrgt", $scope.freight.id, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadFreightList();
                    $scope.freight = {};
                    swal({
                        title: "Success!",
                        text: "You have deleted the freight",
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

    $scope.updateFreight = function() {
        var payload = angular.copy($scope.freight);
        GenericFactory.put("arfrgt", payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.loadFreightList();
                $scope.freight = {};
                swal({
                    title: "Success!",
                    text: "You have updated the freight",
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

    $scope.clearFreightForm = function() {
        $scope.freight = {};
        Alertify.log("Freight form has been cleaned successfully");
    };

}]);
