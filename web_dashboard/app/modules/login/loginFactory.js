app.factory("LoginFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

    var methods = {};

    methods.login = function (payload) {
        var q = $q.defer();

        var parameters = JSON.stringify(payload);
        var api = $rootScope.api_url + "login/";
        $http.post(
            api,
            parameters
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.verify = function () {
        var q = $q.defer();

        var web_token = localStorage.getItem("token");
        var api = $rootScope.api_url + "auth/" + web_token;
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
