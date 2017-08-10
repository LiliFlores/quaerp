app.controller('PurchaseOrderController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "$filter", "fileUpload", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, $filter, fileUpload) {
	$rootScope.page_title = "Purchase Orders";
	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.po = {};
	$scope.po.items = [];
	$scope.po_method_list = ["Create Purchase Order", ""];
		
	$scope.vendor_list = [];
    
	/*var vendor_prom = GenericFactory.get("apvendor ", "", custom_headers);
	var fob_prom = GenericFactory.get("arfob", "", custom_headers);
	
	vendor_prom.then(function (response) {
		if (response.status) {
			$scope.vendor_list = response.results;
		}
		return fob_prom;
	});*/

	$scope.openVendorModal = function () {
		$("#VendorModal").modal("show");
	}

	$scope.selectVendor = function (vendor) {
		$scope.po.vendor = angular.copy(vendor);
		$("#VendorModal").modal("hide");
	};

	$scope.loadVendorList = function () {
		$scope.vendor_list = [];
		GenericFactory.get("apvendor", "limit/20", custom_headers).then(function (response) {
			if (response.status) {
				$scope.vendor_list = response.results;
			}
		});
	};
	$scope.loadVendorList();


}]);
app.controller('PurchaseOrderInformationController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "$filter", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, $filter) {
	

}]);

app.controller('PurchaseOrderNotepadController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {
	console.log("asd");
}]);

