app.factory("UserFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

    var methods = {};

    methods.create = function (payload) {
        var q = $q.defer();

        var parameters = JSON.stringify(payload);
        var api = $rootScope.api_url + "user/";
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

    methods.delete = function (user_id) {
        var q = $q.defer();

        // var parameters = JSON.stringify(payload);
        var api = $rootScope.api_url + "user/" + user_id;
        $http.delete(
            api
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.getOne = function (user_id) {
        var q = $q.defer();

        var api = $rootScope.api_url + "user/" + user_id;
        $http.get(
            api
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.update = function (user_id, payload) {
        var q = $q.defer();

        var api = $rootScope.api_url + "user/" + user_id;
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

    methods.changeActiveState = function (user_id) {
        var q = $q.defer();

        var api = $rootScope.api_url + "user/changestate/" + user_id;
        $http.get(
            api
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    }

    return methods;
}]);
