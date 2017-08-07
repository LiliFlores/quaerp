app.controller('CompanyDeleteController', ["$scope", "$rootScope", "GenericFactory", "$state", function($scope, $rootScope, GenericFactory, $state) {
    // Browser title
    $rootScope.page_title = "Delete Company";

    $scope.selected_company_to_delete = {};

    $scope.company_list = [];
    $scope.loadCompanyList = function() {
        GenericFactory.get("smcompany").then(function(response) {
            if (response.status) {
                $scope.company_list = response.results;
            }
        });
    };
    $scope.loadCompanyList();

    $scope.deleteCompany = function() {
        var company_id = $scope.selected_company_to_delete.id;
        GenericFactory.delete("smcompany", company_id).then(function(response) {
            if (response.status) {
                $scope.selected_company_to_delete = {};
                swal({
                    title: "Success!",
                    text: "You have deleted the company.",
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


    // $scope.submitDeleteCompany = function() {
    //     var current_company = $scope.company_list[$scope.selected_company];
    //     // console.log(current_company);
    //
    //     if (typeof(current_company) != "undefined") {
    //         if (current_company.groups.length > 0) {
    //             var alert_message = "The company that you are trying to delete still have {0} groups!".format(
    //                 current_company.groups.length
    //             );
    //             swal({
    //                 title: "Take it easy cowboy!",
    //                 text: alert_message,
    //                 type: "warning"
    //             });
    //         } else {
    //             // alert("good to go {0}".format(current_company.id));
    //             GenericFactory.delete(current_company.id).then(function (response) {
    //                 if (response.status) {
    //                     swal({
    //                         title: "Good job!",
    //                         text: "The company has been deleted successfully!",
    //                         type: "success",
    //                         timer: 2000
    //                     });
    //                     $state.go("dashboard");
    //                     $scope.loadCompanyToSideBar();
    //                 } else {
    //                     console.error(response);
    //                 }
    //             });
    //         }
    //     }
    //
    // };

}]);
