app.controller('InventorySetupController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "$filter", "fileUpload", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, $filter, fileUpload) {


	$rootScope.page_title = "Inventory Maintenance";
	$scope.inventory = {};
	$scope.inventory_method_list = ["add", "amend"];

	$scope.$watch("inventory.item", function () {
		//console.log($scope.inventory.item);
		if (angular.isDefined($scope.inventory.item)) {
			GenericFactory.get("ictype", $scope.inventory.item.ctype, custom_headers).then(function (response) {
				if (response.status) {
					$scope.inventory.item.glaccount = response.results[0];
				} else {

				}
			});
		}

	}, 1);


	$scope.$watch("contact_list", function () {
		console.log($scope.contact_list);
	}, 1);
	$scope.$watch("card_list", function () {
		console.log($scope.card_list);
	}, 1);



	$scope.customer = {};
	// $scope.customer = {"ccustno": "asd","cstatus": "A","cwarehouse": "MAIN","cbilltono": "A01","cshiptono": "A01","ctaxcode": "1.00","crelaseno": "asd","caddr1": "adr1","caddr2": "adr2","ccity": "ct","cstate": "st","czip": "zo","ccountry": "c","cfname": "fname","clname": "lastt","cdear": "dear","ctitle": "tit","cphone1": "ph1","cphone2": "ph2","cfax": "fax","cemail": "email@email.com","cslpnno": "CK","notepad": "asd","ndiscrate": 11,"cpricecd": "100","crevncode": "CSO","cpaycode": "2%10NET30","ccurrcode": "USD","glaccount": "1001"};
	$scope.contact_list = [];
	// $scope.contact_list = [{"$$hashKey": "object:120","cfname": "qwe","clname": "asd","ctitle": "zxc","cphone": "wer","cemail": "sdf","cfax": "xcv"}, {"$$hashKey": "object:124","cfname": "tyu","clname": "ghj","ctitle": "bnm","cphone": "vbn","cemail": "fghrty","cfax": "rty"}];
	$scope.card_list = [];
	// $scope.card_list = [{"deleted":false,"cpaycode":"2%10NET30","ccardno":"3213213213","cexpdate":"21321","ccardname":"asdasdads"},{"deleted":false,"cpaycode":"C.O.D","ccardno":"1111111111","cexpdate":"123123","ccardname":"qweqweqwe"}];

	$scope.itemTypes = [];

	//     "address": "address1",
	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.toggleCheckbox = function (value) {
		console.log("Cambiar : " + value);
		if (value == 1)
			value = 0
		else
			value = 1
		//value = (value == 1)  ? 1 : 0
	}
	$scope.openSearchItemModal = function () {
		$("#SelectInventoryModal").modal("show");
	}

	$scope.checkItemExist = function () {
		var target = $filter("filter")($scope.items_list, { citemno: $scope.inventory.item.citemno })
		console.log("Length es  : " + target.length);
		if (target.length > 0) {
			$scope.inventory.item = angular.copy(target[0]);
			var value = $filter("filter")($scope.items_types, { cclass: $scope.inventory.item.ctype })[0];
			$scope.inventory.item.type = angular.copy(value);

		}
		if (target.length == 0 && !($scope.inventory.item.ctype)) {
			$('#ChangeTypeModal').modal('show');
		}

	}
	$scope.selectInventoryItem = function (item) {
		//$scope.inventory.item = item;
		$scope.inventory.item = angular.copy(item);
		var value = $filter("filter")($scope.items_types, { cclass: $scope.inventory.item.ctype })[0];
		$scope.inventory.item.type = angular.copy(value);
		//$scope.inventory.item.type = type;

		var value2 = $filter("filter")($scope.revenue_list, { crevncode: $scope.inventory.item.crevncode })[0];
		$scope.inventory.revenue = angular.copy(value2);

		if($scope.inventory.item.dcreate == null)
		{
			$scope.inventory.item.dcreate = $filter("date")(Date.now(), 'yyyy-MM-dd');
		}
		$scope.inventory.item.dcreate = new Date($scope.inventory.item.dcreate);
		$("#SelectInventoryModal").modal("hide");
	};

	$scope.test = function () {
		console.log($scope.inventory.item.nqtydec);
	}

	$scope.loadRevenueList = function () {
		$scope.revenue_list = [];
		GenericFactory.get("arrevn", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.revenue_list = response.results;
				//console.log("Response types : ", JSON.stringify(response));
			}
		});
	};
	$scope.loadRevenueList();

	$scope.selectInventoryItemType = function (type) {
		$scope.inventory.item.type = type;
		$scope.inventory.item.ctype = type.cclass;
		$("#TypesModalTable").modal("hide");
	};

	$scope.selectProductLine = function (productline) {
		$scope.inventory.item.cprodline = productline.code;
		$("#SelectProductLineModal").modal("hide");
	};


	$scope.selectClass = function (cclass) {
		$scope.inventory.item.cclass = cclass.code;
		$("#SelectClassModal").modal("hide");
	};

	$scope.selectBuyer = function (buyer) {
		$scope.inventory.item.cbuyer = buyer.code;
		$("#SelectBuyerModal").modal("hide");
	};

	$scope.selectVendor = function (vendor) {
		$scope.inventory.item.cvendno = vendor.cvendno;
		$("#SelectVendorModal").modal("hide");
	};

	$scope.selectType = function (type) {
		$scope.inventory.item.ctype = type;
		$("#ChangeTypeModal").modal("hide");
	};


	$scope.openSearchWhseModal = function () {
		$("#SelectWhseModal").modal("show");
	}

	$scope.selectWhse = function (item) {
		//$scope.inventory.item = item;
		//$scope.inventory.item = item;
		$("#SelectWhseModal").modal("hide");
	};

	$scope.loadWhsList = function () {
		$scope.whs_list = [];
		GenericFactory.get("icwhse", "limit/20", custom_headers).then(function (response) {
			if (response.status) {
				$scope.whs_list = response.results;
			}
		});
	};
	$scope.loadWhsList();

	$scope.loadVendorList = function () {
		$scope.vendor_list = [];
		GenericFactory.get("icvendor", "limit/20", custom_headers).then(function (response) {
			if (response.status) {
				$scope.vendor_list = response.results;
			}
		});
	};
	$scope.loadVendorList();

	$scope.selectUofM = function (uofm) {
		$scope.inventory.item.cmeasure = uofm.cmeasure;
		$("#SelectUofMModal").modal("hide");
	};

	$scope.loadUofMList = function () {
		$scope.uofm_list = [];
		GenericFactory.get("icunit", "limit/20", custom_headers).then(function (response) {
			if (response.status) {
				$scope.uofm_list = response.results;
			}
		});
	};
	$scope.loadUofMList();

	$scope.inventory_list = [];
	$scope.cont_list = [];
	$scope.warehouse_list = [];
	$scope.salesperson_list = [];
	$scope.remark_list = [];
	$scope.paycode_list = [];
	$scope.cusaddr_list = [];
	$scope.saletax_list = [];
	$scope.revenue_list = [];
	$scope.currency_list = [];
	$scope.glaccount_list = [];
	$scope.crd_list = [];
	$scope.vendor_list = [];

	// var customer_prom = GenericFactory.get("arcust", "", custom_headers);
	var warehouse_prom = GenericFactory.get("arwhse", "", custom_headers);
	var salesperson_prom = GenericFactory.get("arslpn", "", custom_headers);
	var remark_prom = GenericFactory.get("arirmk", "", custom_headers);
	var paycode_prom = GenericFactory.get("arpycd", "", custom_headers);
	var cusaddr_prom = GenericFactory.get("arcadr", "", custom_headers);
	var saletax_prom = GenericFactory.get("costax", "", custom_headers);
	var revenue_prom = GenericFactory.get("arrevn", "", custom_headers);
	var currency_prom = GenericFactory.get("cocurr", "", custom_headers);
	var glaccount_prom = GenericFactory.get("glaccounts", "", custom_headers);
	var items_prom = GenericFactory.get("icitem", "", custom_headers);
	var types_prom = GenericFactory.get("ictype", "", custom_headers);
	var vendor_prom = GenericFactory.get("icvendor", "", custom_headers);
	var product_proms = GenericFactory.get("icproduct", "", custom_headers);
	// var card_prom = GenericFactory.get("arcard", "", custom_headers);


	$scope.loadItemsList = function () {
		$scope.items_list = [];
		GenericFactory.get("icitem", "limit/20", custom_headers).then(function (response) {
			if (response.status) {
				$scope.items_list = response.results;
			}
		});
	};
	$scope.loadItemsList();

	// Load Items Types
	$scope.loadTypesList = function () {
		$scope.items_types = [];
		GenericFactory.get("ictype", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.items_types = response.results;
				//console.log("Response types : ", JSON.stringify(response));
			}
		});
	};
	$scope.loadTypesList();

	// Load ProductLine
	$scope.loadProductLineList = function () {
		$scope.productline_list = [];
		GenericFactory.get("icproduct", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.productline_list = response.results;
				//onsole.log("Response types : ", JSON.stringify(response));
			}
		});
	};
	$scope.loadProductLineList();

	$scope.loadClassList = function () {
		$scope.class_list = [];
		GenericFactory.get("icclass", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.class_list = response.results;
				//console.log("Response types : ", JSON.stringify(response));
			}
		});
	};
	$scope.loadClassList();

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

	$scope.loadGLAccountList = function () {
		$scope.glaccount_list = [];
		GenericFactory.get("glaccounts", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.glaccount_list = response.results;
				//console.log("Response types : ", JSON.stringify(response));
			}
		});
	};
	$scope.loadGLAccountList();
	$scope.saveInventory = function () {
		var inventory_payload = angular.copy($scope.inventory.item);

		if ($filter("filter")($scope.items_list, { citemno: $scope.inventory.item.citemno }).length == 0) {
			//Save new Item
			//console.log('Entro a save new one');
			GenericFactory.post("icitem", inventory_payload, custom_headers).then(function (response) {
				//console.log(JSON.stringify($scope.inventory.item) + JSON.stringify(response));
				if (response.status) {
					var message = "You have added a new Item";
					swal({
						title: "Success!",
						text: message,
						type: "success"
					});
					$scope.clearInventory();
					//$scope.$apply();
					//$scope.reload();
					$scope.inventory = {};
					$scope.items_list = {};
					$scope.loadItemsList();
					$state.go("inventory_information");
				} else {
					//	console.log(response);
					swal({
						title: "Error!",
						text: "Please, contact admin.",
						type: "error"
					});
				}
			});
		}
		else {

			var inventory_payload = angular.copy($scope.inventory.item);
			delete inventory_payload.type
			delete inventory_payload.glaccount
			if (inventory_payload.lkititem)
				inventory_payload.lkititem = 1
			else
				inventory_payload.lkititem = 0

			GenericFactory.put("icitem", inventory_payload, custom_headers).then(function (response) {
				console.log(JSON.stringify($scope.inventory.item) + JSON.stringify(response));
				//GenericFactory.post("icitem", inventory_payload, custom_headers).then(function (response) {
				if (response.status) {
					var message = "Item updated correctly!";
					swal({
						title: "Success!",
						text: message,
						type: "success"
					});
					//$scope.clearInventory();
					$scope.inventory = {};
					$scope.items_list = {};
					//$scope.$apply();
					//$scope.reload();
					$scope.loadItemsList();
					$state.go("inventory_information");
				} else {
					console.log(response);
					swal({
						title: "Error!",
						text: "Please, contact admin.",
						type: "error"
					});
				}
			});
		}
	}
	$scope.clearInventory = function () {
		$scope.inventory = {};
		$scope.contact_list = [];
		$scope.card_list = [];
		//$scope.items_list = [];
	};

	$scope.updateCustomerData = function (customer) {
		$scope.customer = customer;
		$scope.contact_list = [];
		$scope.cont_list.forEach(function (contact) {
			if (contact.ccustno == customer.ccustno) {
				contact.in_db = true;
				contact.deleted = false;
				$scope.contact_list.push(contact);
			}
		});

		$scope.card_list = [];
		$scope.crd_list.forEach(function (card) {
			if (card.ccustno == customer.ccustno) {
				card.in_db = true;
				card.deleted = false;
				$scope.card_list.push(card);
			}
		});
	};

	$scope.deleteCustomer = function () {
		console.log($scope.customer);
		GenericFactory.delete("arcust", $scope.customer.id, custom_headers).then(function (response) {
			if (response.status) {
				var message = "You have deleted a customer";
				swal({
					title: "Success!",
					text: message,
					type: "success"
				});

				$scope.loadCustomerList();
				$scope.clearCustomer();
			} else {
				console.log(response);
				swal({
					title: "Error!",
					text: "Please, contact admin.",
					type: "error"
				});
			}
		});

	};

}]);
app.controller('InventorySetupInformationController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "$filter", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, $filter) {
	//     "address": "address1",
	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};
	$scope.loadTypesList = function () {
		$scope.items_types = [];
		GenericFactory.get("ictype", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.items_types = response.results;
				//console.log("Response types : ", JSON.stringify(response));
			}
		});
	};
	$scope.loadTypesList();

	$scope.date = $filter("date")(Date.now(), 'yyyy-MM-dd');
	$scope.changeTypeModal = function () {
		$('#ChangeTypeModal').modal('show');
	}
	$scope.showTypesModalTable = function () {
		//$('#TypesModalTable').modal('show');

		$("#TypesModalTable").modal("show");
	}

	$scope.SelectUofMModal = function () {
		$("#SelectUofMModal").modal("show");
	}
	$scope.SelectClassModal = function () {
		$("#SelectClassModal").modal("show");
	}
	$scope.SelectProductLineModal = function () {
		$("#SelectProductLineModal").modal("show");
	}

	$scope.SelectBuyerModal = function () {
		$("#SelectBuyerModal").modal("show");
	}

	$scope.SelectVendorModal = function () {
		$("#SelectVendorModal").modal("show");
	}

	$scope.openAddressModal = function (address_type) {
		$scope.address_type = address_type;
		$("#SelectAddressModal").modal("show");
	};

	$scope.selectAddress = function (selected_address) {
		if ($scope.address_type == "bill") {
			$scope.customer.cbilltono = selected_address.caddrno;
		} else {
			$scope.customer.cshiptono = selected_address.caddrno;
		}
		$("#SelectAddressModal").modal("hide");
	};

	$scope.openSalesTaxModal = function () {
		$("#SelectSalesTaxModal").modal("show");
	};

	$scope.selectSalesTax = function (selected_salestax) {
		$scope.customer.ctaxcode = selected_salestax.ctaxcode;
		$("#SelectSalesTaxModal").modal("hide");
	};

	$scope.openSalespersonModal = function (selected_salesperson) {
		$("#SelectSalespersonModal").modal("show");
	};

	$scope.selectSalesperson = function (selected_salesperson) {
		$scope.customer.cslpnno = selected_salesperson.cslpnno;
		$("#SelectSalespersonModal").modal("hide");
	};

	function MainCtrl($scope, dateFilter) {
		$scope.date = new Date();

		$scope.$watch('date', function (date) {
			$scope.inventory.item.dcreate = dateFilter(date, 'yyyy-MM-dd');
		});

		$scope.$watch('dateString', function (dateString) {
			$scope.date = new Date(inventory.item.dcreate);
		});
	}

}]);

app.controller('InventorySetupRemarkImageController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "fileUpload", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, fileUpload) {

	console.log('Element : ' + JSON.stringify($scope.inventory.item));
	$scope.onImageSuccess = function (response) {
		$scope.inventory.item.cimagepath = response.data.path;
	}

	$scope.uploadFile = function () {
		var file = $scope.myFile;
		console.log('file is ');
		console.dir(file);

		var uploadUrl = $rootScope.api_url + "save_form.php";
		var text = $scope.name;
		fileUpload.uploadFileToUrl(file, uploadUrl, text);
	};
	$scope.changeTypeModal = function () {
		$('#ChangeTypeModal').modal('show');
	}
	$scope.showTypesModalTable = function () {

		$("#TypesModalTable").modal("show");
	}


}]);

app.controller('InventorySetupGLAccountsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", "$filter", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory, $filter) {

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};
	$scope.openGLAccountModal = function () {
		$("#SelectGLAccountModal").modal("show");
	};

	$scope.selectGLAccount = function (selected_glaccount) {
		$scope.inventory.item.glaccount.cinvtacc = selected_glaccount.id;
		$("#SelectGLAccountModal").modal("hide");
	};


	$scope.openGLIntraccModal = function () {
		$("#SelectGLAccountIntraccModal").modal("show");
	};

	$scope.selectGLAccountIntracc = function (selected_glaccount) {
		$scope.inventory.item.glaccount.cintracc = selected_glaccount.id;
		$("#SelectGLAccountIntraccModal").modal("hide");
	};

	$scope.openRevenueModal = function () {
		$("#SelectRevenueModal").modal("show");
	};

	$scope.selectRevenue = function (revenue) {
		var value2 = $filter("filter")($scope.revenue_list, { crevncode: revenue.crevncode })[0];
		$scope.inventory.revenue = angular.copy(value2);
		$scope.inventory.item.crevncode = revenue.crevncode;
		$("#SelectRevenueModal").modal("hide");
	};



}]);

app.controller('InventorySetupNotepadController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {
	console.log("asd");
}]);

app.controller('InventorySetupSettingsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	$scope.inventory_status_list = [
		{
			"status": "A",
			"description": "Active"
		},
		{
			"status": "B",
			"description": "Inactive"
		}
	];

	$scope.inventory_cost_list = [
		{
			"status": "A",
			"description": "Average"
		},
		{
			"status": "I",
			"description": "Inactive"
		}
	];


	$scope.selectRevenue = function (selected_revenue) {
		$scope.inventory.crevncode = selected_revenue.crevncode;
		$("#SelectRevenueModal").modal("hide");
	};

	$scope.openPaycodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (selected_paycode) {
		$scope.inventory.cpaycode = selected_paycode.cpaycode;
		$("#SelectPaycodeModal").modal("hide");
	};

	$scope.openCurrencyModal = function () {
		$("#SelectCurrencyModal").modal("show");
	};

	$scope.selectCurrency = function (selected_currency) {
		$scope.inventory.ccurrcode = selected_currency.ccurrcode;
		$("#SelectCurrencyModal").modal("hide");
	};

	$scope.addCard = function () {
		$scope.card_list.push({
			id_db: false,
			deleted: false
		});
	};

	$scope.removeCard = function ($index) {
		$scope.card_list[$index].deleted = true;
	};

}]);

app.directive('currencyInput', function ($filter, $browser) {
	return {
		require: 'ngModel',
		link: function ($scope, $element, $attrs, ngModelCtrl) {
			var listener = function () {
				var value = $element.val().replace(/,/g, '')
				$element.val($filter('number')(value, false))
			}

			ngModelCtrl.$parsers.push(function (viewValue) {
				return viewValue.replace(/,/g, '');
			})

			ngModelCtrl.$render = function () {
				$element.val($filter('number')(ngModelCtrl.$viewValue, false))
			}

			$element.bind('change', listener)
			$element.bind('keydown', function (event) {
				var key = event.keyCode
				if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
					return
				$browser.defer(listener)
			})

			$element.bind('paste cut', function () {
				$browser.defer(listener)
			})
		}
	}
});



app.$inject = ['$scope'];


app.directive('format', ['$filter', function ($filter) {
	return {
		require: '?ngModel',
		link: function ($scope, elem, attrs, ctrl) {

			if (!ctrl) return;
			ctrl.$formatters.unshift(function (a) {
				//return $filter(attrs.format)(ctrl.$modelValue)
				return ctrl.$modelValue
			});


			ctrl.$parsers.unshift(function (viewValue) {
				//console.log('Entro a formato ' + JSON.stringify(viewValue));
				elem.priceFormat({
					prefix: '',
					centsSeparator: '.',
					thousandsSeparator: ',',
					centsLimit: 2 //
				});
				//console.log('Es : ' + elem[0].value);
				return elem[0].value;
			});
		}
	};
}]);

(function ($) { $.fn.priceFormat = function (options) { var defaults = { prefix: 'US$ ', suffix: '', centsSeparator: '.', thousandsSeparator: ',', limit: false, centsLimit: 2, clearPrefix: false, clearSufix: false, allowNegative: false, insertPlusSign: false }; var options = $.extend(defaults, options); return this.each(function () { var obj = $(this); var is_number = /[0-9]/; var prefix = options.prefix; var suffix = options.suffix; var centsSeparator = options.centsSeparator; var thousandsSeparator = options.thousandsSeparator; var limit = options.limit; var centsLimit = options.centsLimit; var clearPrefix = options.clearPrefix; var clearSuffix = options.clearSuffix; var allowNegative = options.allowNegative; var insertPlusSign = options.insertPlusSign; if (insertPlusSign) allowNegative = true; function to_numbers(str) { var formatted = ''; for (var i = 0; i < (str.length); i++) { char_ = str.charAt(i); if (formatted.length == 0 && char_ == 0) char_ = false; if (char_ && char_.match(is_number)) { if (limit) { if (formatted.length < limit) formatted = formatted + char_ } else { formatted = formatted + char_ } } } return formatted } function fill_with_zeroes(str) { while (str.length < (centsLimit + 1)) str = '0' + str; return str } function price_format(str) { var formatted = fill_with_zeroes(to_numbers(str)); var thousandsFormatted = ''; var thousandsCount = 0; if (centsLimit == 0) { centsSeparator = ""; centsVal = "" } var centsVal = formatted.substr(formatted.length - centsLimit, centsLimit); var integerVal = formatted.substr(0, formatted.length - centsLimit); formatted = (centsLimit == 0) ? integerVal : integerVal + centsSeparator + centsVal; if (thousandsSeparator || $.trim(thousandsSeparator) != "") { for (var j = integerVal.length; j > 0; j--) { char_ = integerVal.substr(j - 1, 1); thousandsCount++; if (thousandsCount % 3 == 0) char_ = thousandsSeparator + char_; thousandsFormatted = char_ + thousandsFormatted } if (thousandsFormatted.substr(0, 1) == thousandsSeparator) thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length); formatted = (centsLimit == 0) ? thousandsFormatted : thousandsFormatted + centsSeparator + centsVal } if (allowNegative && (integerVal != 0 || centsVal != 0)) { if (str.indexOf('-') != -1 && str.indexOf('+') < str.indexOf('-')) { formatted = '-' + formatted } else { if (!insertPlusSign) formatted = '' + formatted; else formatted = '+' + formatted } } if (prefix) formatted = prefix + formatted; if (suffix) formatted = formatted + suffix; return formatted } function key_check(e) { var code = (e.keyCode ? e.keyCode : e.which); var typed = String.fromCharCode(code); var functional = false; var str = obj.val(); var newValue = price_format(str + typed); if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105)) functional = true; if (code == 8) functional = true; if (code == 9) functional = true; if (code == 13) functional = true; if (code == 46) functional = true; if (code == 37) functional = true; if (code == 39) functional = true; if (allowNegative && (code == 189 || code == 109)) functional = true; if (insertPlusSign && (code == 187 || code == 107)) functional = true; if (!functional) { e.preventDefault(); e.stopPropagation(); if (str != newValue) obj.val(newValue) } } function price_it() { var str = obj.val(); var price = price_format(str); if (str != price) obj.val(price) } function add_prefix() { var val = obj.val(); obj.val(prefix + val) } function add_suffix() { var val = obj.val(); obj.val(val + suffix) } function clear_prefix() { if ($.trim(prefix) != '' && clearPrefix) { var array = obj.val().split(prefix); obj.val(array[1]) } } function clear_suffix() { if ($.trim(suffix) != '' && clearSuffix) { var array = obj.val().split(suffix); obj.val(array[0]) } } $(this).bind('keydown.price_format', key_check); $(this).bind('keyup.price_format', price_it); $(this).bind('focusout.price_format', price_it); if (clearPrefix) { $(this).bind('focusout.price_format', function () { clear_prefix() }); $(this).bind('focusin.price_format', function () { add_prefix() }) } if (clearSuffix) { $(this).bind('focusout.price_format', function () { clear_suffix() }); $(this).bind('focusin.price_format', function () { add_suffix() }) } if ($(this).val().length > 0) { price_it(); clear_prefix(); clear_suffix() } }) }; $.fn.unpriceFormat = function () { return $(this).unbind(".price_format") }; $.fn.unmask = function () { var field = $(this).val(); var result = ""; for (var f in field) { if (!isNaN(field[f]) || field[f] == "-") result += field[f] } return result } })(jQuery);
