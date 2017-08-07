app.controller('CompanyEditController', ["$scope", "$rootScope", "GenericFactory", "$state", function($scope, $rootScope, GenericFactory, $state) {
    // Browser title
    $rootScope.page_title = "Edit Company";

    $scope.selected_company_to_edit = {};

    $scope.company_list = [];
    $scope.loadCompanyList = function() {
        GenericFactory.get("smcompany").then(function(response) {
            if (response.status) {
                $scope.company_list = response.results;
            }
        });
    };

    $scope.loadCompanyList();


    $scope.editCompany = function() {

        var payload = $scope.selected_company_to_edit;
        GenericFactory.put("smcompany", payload).then(function(response) {
            if (response.status) {
                $scope.selected_company_to_edit = {};
                swal({
                    title: "Success!",
                    text: "You have edited the company.",
                    type: "success"
                });
                $scope.loadCompanyToSideBar();
                $scope.loadCompanyList();
            } else {
                swal({
                    title: "Error!",
                    text: "Please, contact admin.",
                    type: "error"
                });
            }
        });

    };


    // Plugins
    $('#company_fdfd').formatter({
        'pattern': '{{99}}/{{99}}/{{9999}}',
        'persistent': true
    });

    $('#company_cfy').formatter({
        'pattern': '{{9999}}',
        'persistent': true
    });

}]);
