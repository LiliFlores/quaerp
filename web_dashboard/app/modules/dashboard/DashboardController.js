app.controller('DashboardController', ["$rootScope", "$scope", "$state", "GenericFactory", function ($rootScope, $scope, $state, GenericFactory) {
    // Browser title
    $rootScope.page_title = "Dashboard";

    $rootScope.syst_selected_company = {};
    $scope.syst_selected_module = {};

    $scope.syst_module_list = [
        {
            "code": "AR",
            "name": "Account Receivable"
        }
    ];

    $scope.api_version_log = {};
    $scope.dashboard_version_log = {};
    GenericFactory.get("version").then(function (response) {
        if (response.status) {
            $scope.api_version_log = response.api;
            $scope.dashboard_version_log = response.dashboard;
        }
    });

    $scope.company_list = [];
    $scope.loadCompanyToSideBar = function() {
        GenericFactory.get("smcompany").then(function (response) {
            $scope.company_list = response.results;
        });
    };
    $scope.loadCompanyToSideBar();

    $scope.selectCompany = function(company) {
        $rootScope.syst_selected_company = company;
        $state.go("dashboard");
    };

    $scope.selectModule = function(module) {
        $scope.syst_selected_module = module;
    };

    $scope.showApiLog = function() {
        var message = `
            <div style='text-align: left'>
                <hr>
                <b>Description</b><br>
                {0}<br>
                <b>Date</b><br>
                {1}<br>
                <b>Author</b><br>
                {2}<br>
                <b>Repository commit</b><br>
                {3}<br>
            </div>`.format(
                $scope.api_version_log.description,
                $scope.api_version_log.date,
                $scope.api_version_log.author,
                $scope.api_version_log.commit
            );
        swal({
            title: "Last change in <u>API</u> repository",
            text: message,
            html: true
        });
    };

    $scope.showDashboardLog = function() {
        var message = `
            <div style='text-align: left'>
                <hr>
                <b>Description</b><br>
                {0}<br>
                <b>Date</b><br>
                {1}<br>
                <b>Author</b><br>
                {2}<br>
                <b>Repository commit</b><br>
                {3}<br>
            </div>`.format(
                $scope.dashboard_version_log.description,
                $scope.dashboard_version_log.date,
                $scope.dashboard_version_log.author,
                $scope.dashboard_version_log.commit
            );

        swal({
            title: "Last change in <u>DASHBOARD</u> repository",
            text: message,
            html: true
        });
    };


    // Plugins
    Breakpoints();
    Site.run();
}]);
