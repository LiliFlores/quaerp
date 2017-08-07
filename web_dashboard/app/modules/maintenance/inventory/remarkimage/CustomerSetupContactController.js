app.controller('CustomerSetupContactController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.addNewContact = function() {
        $scope.contact_list.push({in_db: false, deleted: false});
    };

    $scope.removeContact = function(index) {
        $scope.contact_list[index].deleted = true;
    };

}]);
