app.factory("CompanyFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

    var methods = {};

    methods.get = function () {
        var q = $q.defer();

        var api = $rootScope.api_url + "company/";
        $http.get(
            api
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.update = function (company_id, payload) {
        var q = $q.defer();

        var api = $rootScope.api_url + "company/" + company_id;
        var parameters = JSON.stringify(payload);
        $http.put(
            api,
            parameters
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.delete = function (company_id) {
        var q = $q.defer();

        var api = $rootScope.api_url + "company/" + company_id;
        $http.delete(
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
