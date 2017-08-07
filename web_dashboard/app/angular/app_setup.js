app.run(["$rootScope", "$state", "$http", function($rootScope, $state, $http) {
    // $rootScope.api_url = "http://11.11.11.11/quaerp/web_api/api/";
    $rootScope.api_url = "http://www.quaerp.dreamhosters.com/web_api/api/";

    var system_in_prod = false;
    if (system_in_prod) {
        console.log = function(){};
        console.error = function(){};
    }

    $rootScope.$on('$stateChangeSuccess', function() {
        $("html, body").animate({
            scrollTop: 0
        }, 200);
    });
}]);

app.factory("UserSession", ["GenericFactory", "$rootScope", "$q", "$timeout", "$state", function(GenericFactory, $rootScope, $q, $timeout, $state){
    var methods = {};

    methods.verify = function () {

        var q = $q.defer();
        var status = false;

        var token = localStorage.getItem("token");

        GenericFactory.get("validatetoken", token).then(function(response) {
            if (response.status) {
                $rootScope.logged_user = response.user;
                status = true;
                q.resolve();
            } else {
                swal({
                    title: "Session invalida!",
                    text: "Favor de iniciar session!",
                    showConfirmButton: false,
                    type: "error",
                    timer: 3000
                });
                $timeout(function(){
                    $state.go("login");
                });
                q.reject();
            }
        });

        return q.promise;

    };

    return methods;
}]);


// TODO: DELETE
app.factory("RequireCompany", ["$q", "$timeout", "$state", function($q, $timeout, $state){
    var methods = {};

    methods.check = function(company) {
        var q = $q.defer();

        var status = false;
        if (typeof(company) != "undefined") {
            if (company.id) {
                status = true;
                q.resolve();
            }
        }

        if (status == false) {
            swal({
                title: "No Company selected!",
                text: "Please select a company and try to access this module later.",
                type: "error"
            });
            $timeout(function(){
                $state.go("dashboard");
            });
            q.reject();
        }

        return q.promise;
    }

    return methods;
}]);

app.factory("ModuleAccess", ["$rootScope", "$q", "$timeout", "$interval", "$state", "GenericFactory", function($rootScope, $q, $timeout, $interval, $state, GenericFactory) {

    var methods = {};

    methods.verify = function(module_code, company_needed = false) {

        var q = $q.defer();

        var continue_flow = false;
        if (company_needed) {
            try {
                if (typeof($rootScope.syst_selected_company.id) != "undefined") {
                    continue_flow = true;
                }
            } catch (e) {}
        } else {
            continue_flow = true;
        }

        if (continue_flow) {

            var selected_company = angular.copy($rootScope.syst_selected_company);

            var wait_interval = $interval(function() {

                if ($rootScope.logged_user) {
                    $interval.cancel(wait_interval);

                    var logged_user = angular.copy($rootScope.logged_user);

                    if (logged_user.master == "1") {
                        q.resolve();
                    } else {

                        GenericFactory.get("smuserhassmmodules").then(function (response) {
                            if (response.status) {
                                var status = false;

                                var BreakException = {};
                                try {
                                    response.results.forEach(function(result_row) {
                                        if (company_needed) {
                                            if (result_row.smmodules.code == module_code &&
                                                logged_user.id == result_row.smuser.id &&
                                                result_row.smcompany.id == selected_company.id) {
                                                status = true;
                                                throw BreakException;
                                            }
                                        } else {
                                            if (result_row.smmodules.code == module_code &&
                                                logged_user.id == result_row.smuser.id) {
                                                status = true;
                                                throw BreakException;
                                            }
                                        }
                                    });
                                } catch (e) {
                                    if (e !== BreakException) {
                                        throw e;
                                    }
                                }

                                if (status) {
                                    q.resolve();
                                } else {
                                    q.reject();
                                    swal({
                                        title: "Not allowed to be here!",
                                        text: "But.. if you need to, please contact administrator to access this module later.",
                                        type: "error"
                                    });
                                    $timeout(function(){
                                        $state.go("dashboard");
                                    });
                                }

                            } else {
                                q.reject();
                            }
                        });

                    }
                }
            });

        } else {
            q.reject();
            swal({
                title: "No Company selected!",
                text: "Please select a company and try to access this module later.",
                type: "error"
            });
            $timeout(function(){
                $state.go("dashboard");
            });
        }


        return q.promise;
    };

    return methods;
}]);
