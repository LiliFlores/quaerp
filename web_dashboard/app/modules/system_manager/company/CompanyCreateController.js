app.controller('CompanyCreateController', ["$scope", "$rootScope", "GenericFactory", "$state", function($scope, $rootScope, GenericFactory, $state) {
    // Browser title
    $rootScope.page_title = "Company Setup";


    $scope.company = {};

    // TESTING WITH AUTOVALUES
    // $scope.company.cid = "aidi";
    // $scope.company.name = "company1";
    // $scope.company.address = "address1";
    // $scope.company.city = "city1";
    // $scope.company.state = "state1";
    // $scope.company.zip = 42315;
    // $scope.company.phone = 1234567890;
    // $scope.company.subdirectory = "subdirectory1";
    // $scope.company.nofp = 2; // Number of fiscal periods
    // $scope.company.df = "American"; // date format
    // $scope.company.hcurrency = 3; // home currency
    // $scope.company.fdofd = "05/20/1994"; // First day of fiscal day
    // $scope.company.cfy = "2007"; // Current fiscal year
    // $scope.company.sta = "USA"; // Sales tax address
    //
    // $scope.company.db_hostname = "11.11.11.11";
    // $scope.company.db_port = "3306";
    // $scope.company.db_username = "erick";
    // $scope.company.db_password = "password";

    $scope.createCompany = function() {

        $scope.company.fdofd = document.getElementById("company_fdfd").value;
        $scope.company.cfy = document.getElementById("company_cfy").value;
        $scope.company.db_schema = $scope.company.cid + '_db';

        GenericFactory.post("smcompany", $scope.company).then(function(response) {
            if (response.status) {
                $scope.company = {};
                swal({
                    title: "Success!",
                    text: "You have added a new Company.",
                    type: "success"
                });
                $scope.loadCompanyToSideBar();
            } else {
                swal({
                    title: "Error!",
                    text: "Please, contact admin.",
                    type: "error"
                });
            }
            console.log(response);
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
