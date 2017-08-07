app.factory("GenericFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

    var methods = {};

    methods.post = function (entity_name, payload, headers = "") {
        var q = $q.defer();

        // delete payload["$$hashKey"];
        var parameters = payload;
        var api = $rootScope.api_url + entity_name;
        $http.post(
            api,
            parameters,
            headers
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.get = function (entity_name, entity_id = "", headers = "") {
        var q = $q.defer();

        var api = $rootScope.api_url + entity_name + "/" + entity_id;
        $http.get(
            api,
            headers
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.put = function (entity_name, payload, headers = "") {
        var q = $q.defer();

        // delete payload["$$hashKey"];

        var api = $rootScope.api_url + entity_name;
        var parameters = payload;
        $http.put(
            api,
            parameters,
            headers
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    methods.delete = function (entity_name, entity_id, headers = "") {
        var q = $q.defer();

        var api = $rootScope.api_url + entity_name + "/" + entity_id;
        $http.delete(
            api,
            headers
        ).success(function (data, status, headers, config) {
            q.resolve(data);
        }).error(function (data, status, headers, config) {
            q.reject(data);
        });

        return q.promise;
    };

    return methods;
}]);
