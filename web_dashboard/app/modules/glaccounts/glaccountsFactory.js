app.factory("GlAccountsFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

    var methods = {};

    methods.get = function () {
        var q = $q.defer();

        var api = $rootScope.api_url + "glaccounts/";
        $http.get(
            api
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    return methods;
}]);
