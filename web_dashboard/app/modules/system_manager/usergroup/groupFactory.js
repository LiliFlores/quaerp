app.factory("GroupFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

    var methods = {};

    methods.create = function (payload) {
        var q = $q.defer();

        var parameters = JSON.stringify(payload);
        var api = $rootScope.api_url + "user/group/";
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

    methods.get = function (company_id) {
        var q = $q.defer();

        var api = $rootScope.api_url + "user/group/" + company_id;
        console.log(api);
        $http.get(
            api
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.update = function (group_id, payload) {
        var q = $q.defer();

        var api = $rootScope.api_url + "user/group/" + group_id;
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

    methods.delete = function (group_id) {
        var q = $q.defer();

        var api = $rootScope.api_url + "user/group/" + group_id;
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
