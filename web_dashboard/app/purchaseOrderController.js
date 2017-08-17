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
	$scope.fob_list = [];
	$scope.warehouse_list = [];
	$scope.shipvia_list = [];
	$scope.paycode_list = [];
	$scope.saletax_list = [];
	$scope.item_list = [];
	$scope.paycode_list = [];
	$scope.cusaddr_list = [];
	$scope.saletax_list = [];
    
	var vendor_prom = GenericFactory.get("apvendor ", "", custom_headers);
	var fob_prom = GenericFactory.get("arfob", "", custom_headers);
	var warehouse_prom = GenericFactory.get("arwhse", "", custom_headers);
	var shipvia_prom = GenericFactory.get("arfrgt", "", custom_headers);
	var paycode_prom = GenericFactory.get("arpycd", "", custom_headers);
	var saletax_prom = GenericFactory.get("costax", "", custom_headers);
	var item_prom = GenericFactory.get("icitem", "limit/3", custom_headers);

	var type_prom = GenericFactory.get("ictype", "limit/3", custom_headers);

	var paycode_prom = GenericFactory.get("arpycd", "", custom_headers);
	var cusaddr_prom = GenericFactory.get("arcadr", "", custom_headers);
	var saletax_prom = GenericFactory.get("costax", "", custom_headers);
	var exchangerate_prom = GenericFactory.get("cocurr", "", custom_headers);
	
	vendor_prom.then(function (response) {
		if (response.status) {
			$scope.vendor_list = response.results;
		}
		return fob_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.fob_list = response.results;
		}

		return warehouse_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.warehouse_list = response.results;
		}

		return shipvia_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.shipvia_list = response.results;
		}
		return paycode_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.paycode_list = response.results;
		}

		return saletax_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.saletax_list = response.results;
		}
		return item_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.item_list = response.results;
		}

		return paycode_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.paycode_list = response.results;
		}

		return cusaddr_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.cusaddr_list = response.results;
		}

		return saletax_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.saletax_list = response.results;
		}
	})

  
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

    $scope.SelectBuyerModal = function () {
		$("#SelectBuyerModal").modal("show");
	}

	$scope.selectBuyer = function (buyer) {
		$scope.po.vendor.cbuyer = buyer.code;
		$("#SelectBuyerModal").modal("hide");
	};
	$scope.loadBuyerList = function () {
		$scope.buyer_list = [];
		GenericFactory.get("icbuyer", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.buyer_list = response.results;
				//console.log("Response types : ", JSON.stringify(response));
			}
		});
	};
	$scope.loadBuyerList();

	$scope.openPayCodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (paycode) {
		$scope.po.vendor.cpaycode = paycode.cpaycode;
		$scope.po.cbankno = paycode.cbankno;
		$("#SelectPaycodeModal").modal("hide");
	};

	$scope.openTaxModal = function () {
		$("#SelectSaleTaxModal").modal("show");
	};

	$scope.selectTax = function (tax) {
		$scope.invoice.sales_tax = tax;
		$("#SelectSaleTaxModal").modal("hide");
	};

}]);
app.controller('PurchaseOrderInformationController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "$filter", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, $filter) {
	

}]);

app.controller('PurchaseOrderLineItemsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "$filter", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, $filter) {
	
	$rootScope.enable_print_invoice_preview = true;

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.current_item_to_search = {};
	$scope.selected_item = {};

	$scope.addEmptyItem = function () {
		$scope.po.items.push({
			"discount": 0,
			"shipqty": 1
		});
	};

	$scope.searchStockItem = function (table_row_item) {
		console.log("ÇLICK");
		let item_found = false;
		$scope.item_list.forEach(function (item) {
			if (item.citemno == table_row_item.citemno) {
				table_row_item = Object.assign(table_row_item, item);
				item_found = true;
				return;
			}
		});

		if (!item_found) {
			swal({
				title: "Item not found",
				text: "Want to proceed searching in item table list?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, lets search!",
				closeOnConfirm: true
			}, function () {
				$scope.current_item_to_search = table_row_item;
				$("#AddItemModal").modal("show");
			});
		}

	};

	$scope.addItemToList = function (stock_item) {
		$scope.current_item_to_search = Object.assign($scope.current_item_to_search, stock_item);
		$("#AddItemModal").modal("hide");
	};

	$scope.showItemInfo = function (item) {
		$scope.selected_item = item;
	};

	$scope.removeItem = function ($index) {

		$scope.po.items[$index].deleted = true;
		// if (selected_item.to_update) {
		//     swal({
		//             title: "Are you sure?",
		//             text: "You will not be able to recover this item!",
		//             type: "warning",
		//             showCancelButton: true,
		//             confirmButtonColor: "#DD6B55",
		//             confirmButtonText: "Yes, delete it!",
		//             closeOnConfirm: true
		//         },
		//         function() {
		//             GenericFactory.delete("aritrs", selected_item.id, custom_headers).then(function(response) {
		//                 if (response.status) {
		//                     $scope.invoice.items.splice($index, 1);
		//                     alertify.success("Item deleted");
		//                 } else {
		//                     alertify.error("Please, contact admin");
		//                 }
		//             })
		//
		//         });
		// } else {
		//     $scope.invoice.items.splice($index, 1);
		// }

	};

}]);


app.controller('PurchaseOrderNotepadController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {
	console.log("asd");
}]);


/*app.directive("poDate", ["$rootScope", function ($rootScope) {
	return {
		restrict: "A",
		link: function (scope, elem, attrs) {
			elem.bind('keyup', function () {
				var user_is_master = parseInt($rootScope.logged_user.master);

				var input_date = elem[0].value;
				input_date = input_date.split("/");

				// MX to US date
				var string_date = "{0}/{1}/{2}".format(input_date[0], input_date[1], input_date[2]);
				var input_date = new Date(string_date);
				var current_date = new Date();

				var diff_days = parseInt((current_date - input_date) / (1000 * 60 * 60 * 24));

				if (user_is_master) {
					$rootScope.invoice_date_status = true;
					scope.$apply(function () {
						scope.invoice.dinvoice = string_date;
					});
				} else {
					if ((diff_days < 30) && (diff_days > 0)) {
						$rootScope.invoice_date_status = true;
						scope.$apply(function () {
							scope.invoice.dinvoice = string_date;
						});
					} else {
						$rootScope.invoice_date_status = false;
						scope.$apply(function () {
							scope.invoice.dinvoice = string_date;
						});
					}
				}

			});
		}
	};
}]);

app.directive("orderDate", ["$rootScope", function ($rootScope) {
	return {
		restrict: "A",
		link: function (scope, elem, attrs) {
			elem.bind('keyup', function () {
				var user_is_master = parseInt($rootScope.logged_user.master);

				var input_date = elem[0].value;
				input_date = input_date.split("/");

				// MX to US date
				var string_date = "{0}/{1}/{2}".format(input_date[0], input_date[1], input_date[2]);
				var input_date = new Date(string_date);
				var current_date = new Date();

				var diff_days = parseInt((current_date - input_date) / (1000 * 60 * 60 * 24));

				if (user_is_master) {
					$rootScope.order_date_status = true;
					scope.$apply(function () {
						scope.invoice.dorder = string_date;
					});
				} else {
					if ((diff_days < 30) && (diff_days > 0)) {
						$rootScope.order_date_status = true;
						scope.$apply(function () {
							scope.invoice.dorder = string_date;
						});
					} else {
						$rootScope.order_date_status = false;
						scope.$apply(function () {
							scope.invoice.dorder = string_date;
						});
					}
				}

			});
		}
	};
}]);

app.directive("poDate", ["$rootScope", function ($rootScope) {
	return {
		restrict: "A",
		link: function (scope, elem, attrs) {
			elem.bind('keyup', function () {
				var user_is_master = parseInt($rootScope.logged_user.master);

				var input_date = elem[0].value;
				input_date = input_date.split("/");

				// MX to US date
				var string_date = "{0}/{1}/{2}".format(input_date[0], input_date[1], input_date[2]);
				var input_date = new Date(string_date);
				var current_date = new Date();

				var diff_days = parseInt((current_date - input_date) / (1000 * 60 * 60 * 24));

				if (user_is_master) {
					$rootScope.invoice_date_status = true;
					scope.$apply(function () {
						scope.invoice.dinvoice = string_date;
					});
				} else {
					if ((diff_days < 30) && (diff_days > 0)) {
						$rootScope.invoice_date_status = true;
						scope.$apply(function () {
							scope.invoice.dinvoice = string_date;
						});
					} else {
						$rootScope.invoice_date_status = false;
						scope.$apply(function () {
							scope.invoice.dinvoice = string_date;
						});
					}
				}

			});
		}
	};
}]);

app.directive("orderDate", ["$rootScope", function ($rootScope) {
	return {
		restrict: "A",
		link: function (scope, elem, attrs) {
			elem.bind('keyup', function () {
				var user_is_master = parseInt($rootScope.logged_user.master);

				var input_date = elem[0].value;
				input_date = input_date.split("/");

				// MX to US date
				var string_date = "{0}/{1}/{2}".format(input_date[0], input_date[1], input_date[2]);
				var input_date = new Date(string_date);
				var current_date = new Date();

				var diff_days = parseInt((current_date - input_date) / (1000 * 60 * 60 * 24));

				if (user_is_master) {
					$rootScope.order_date_status = true;
					scope.$apply(function () {
						scope.invoice.dorder = string_date;
					});
				} else {
					if ((diff_days < 30) && (diff_days > 0)) {
						$rootScope.order_date_status = true;
						scope.$apply(function () {
							scope.invoice.dorder = string_date;
						});
					} else {
						$rootScope.order_date_status = false;
						scope.$apply(function () {
							scope.invoice.dorder = string_date;
						});
					}
				}

			});
		}
	};
}]);*/

