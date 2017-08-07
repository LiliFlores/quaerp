app.controller('CustomerSetupAnalysisController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {
	console.log("asd");
}]);

app.controller('CustomerSetupController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	// $rootScope.syst_selected_company = {
	//     "id": "7",
	//     "cid": "sapi",
	//     "name": "Qualfin SAPI",
	//     "address": "address1",
	//     "city": "city1",
	//     "state": "state1",
	//     "zip": "42315",
	//     "phone": "1234567890",
	//     "subdirectory": "subdirectory1",
	//     "nofp": "2",
	//     "df": "American",
	//     "hcurrency": "USD",
	//     "fdofd": "05/20/1994",
	//     "cfy": "2007",
	//     "sta": "USA",
	//     "db_hostname": "11.11.11.11",
	//     "db_port": "3306",
	//     "db_username": "erick",
	//     "db_password": "password",
	//     "db_schema": "sapi_db",
	//     "created": "2017-02-02 10:12:27",
	//     "updated": null,
	//     "$$hashKey": "object:31"
	// };

	$scope.customer_method_list = ["add", "amend"];

	$scope.$watch("customer", function () {
		console.log($scope.customer);
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

	$scope.customer.cstatus = "A";

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.customer_list = [];
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
	// var card_prom = GenericFactory.get("arcard", "", custom_headers);

	$scope.loadCustomerList = function () {
		GenericFactory.get("arcust", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.customer_list = response.results;
			}
		});
	};
	$scope.loadCustomerList();

	$scope.loadContactList = function () {
		$scope.cont_list = [];
		GenericFactory.get("arcont", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.cont_list = response.results;
				console.log("GET contact list!");
				console.log($scope.cont_list);
			}
		});
	};
	$scope.loadContactList();

	$scope.loadCardList = function () {
		$scope.crd_list = [];
		GenericFactory.get("arcard", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.crd_list = response.results;
			}
		});
	};
	$scope.loadCardList();

	warehouse_prom.then(function (response) {
		if (response.status) {
			$scope.warehouse_list = response.results;
		}

		return salesperson_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.salesperson_list = response.results;
		}

		return remark_prom;
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

		return revenue_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.revenue_list = response.results;
		}

		return currency_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.currency_list = response.results;
		}

		return glaccount_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.glaccount_list = response.results;
		}
	});

	$scope.saveCustomer = function () {

		switch ($scope.customer_action) {
			case "add":
				var customer_payload = angular.copy($scope.customer);
				GenericFactory.post("arcust", customer_payload, custom_headers).then(function (response) {
					console.log(JSON.stringify($scope.customer) + JSON.stringify(response));
					if (response.status) {
						$scope.contact_list.forEach(function (contact) {
							var contact_payload = angular.copy(contact);
							delete contact_payload.in_db;
							contact_payload.ccustno = customer_payload.ccustno;
							GenericFactory.post("arcont", contact_payload, custom_headers);
						});

						$scope.card_list.forEach(function (card) {
							var card_payload = angular.copy(card);
							delete card_payload.deleted;
							card_payload.ccustno = customer_payload.ccustno;
							GenericFactory.post("arcard", card_payload, custom_headers);
						});

						var message = "You have added a new Customer";
						swal({
							title: "Success!",
							text: message,
							type: "success"
						});

						$scope.clearCustomer();
						$scope.customer_action = "add";
						$state.go("customer_information");

						$scope.loadCustomerList();
						$scope.loadContactList();
						$scope.loadCardList();
					} else {
						console.log(response);
						swal({
							title: "Error!",
							text: "Please, contact admin.",
							type: "error"
						});
					}
				});
				break;
			case "amend":
				var customer_payload = angular.copy($scope.customer);
				GenericFactory.put("arcust", customer_payload, custom_headers).then(function (response) {
					if (response.status) {

						var prom_list = [];
						$scope.contact_list.forEach(function (contact) {
							var contact_payload = angular.copy(contact);
							// delete contact_payload.in_db;

							if (contact_payload.in_db) {
								delete contact_payload.in_db;
								if (contact_payload.deleted) {
									prom_list.push(GenericFactory.delete("arcont", contact_payload.id, custom_headers));
								} else {
									delete contact_payload.deleted;
									prom_list.push(GenericFactory.put("arcont", contact_payload, custom_headers));
								}
							} else {
								delete contact_payload.in_db;
								delete contact_payload.deleted;
								contact_payload.ccustno = customer_payload.ccustno;
								prom_list.push(GenericFactory.post("arcont", contact_payload, custom_headers));
							}
						});

						$scope.card_list.forEach(function (card) {
							var card_payload = angular.copy(card);
							card_payload.ccustno = customer_payload.ccustno;

							if (card_payload.in_db) {
								delete card_payload.in_db;
								if (card_payload.deleted) {
									prom_list.push(GenericFactory.delete("arcard", card_payload.id, custom_headers));
								} else {
									delete card_payload.deleted;
									prom_list.push(GenericFactory.put("arcard", card_payload, custom_headers));
								}
							} else {
								delete card_payload.in_db;
								delete card_payload.deleted;
								card_payload.ccustno = card_payload.ccustno;
								prom_list.push(GenericFactory.post("arcard", card_payload, custom_headers));
							}
						});

						$q.all(prom_list).then(function () {
							// console.log("sheeet:");
							$scope.contact_list = [];
							$scope.card_list = [];
							$scope.cont_list = [];
							$scope.crd_list = [];
							$scope.loadCardList();
							$scope.loadContactList();
							$scope.clearCustomer();
							$scope.loadCustomerList();
						});

						var message = "You have added a new Customer";
						swal({
							title: "Success!",
							text: message,
							type: "success"
						});

						$scope.customer_action = "add";
						$state.go("customer_information");
					} else {
						console.log(response);
						swal({
							title: "Error!",
							text: "Please, contact admin.",
							type: "error"
						});
					}
				});
				break;
			default:

		}

	};

	$scope.clearCustomer = function () {
		$scope.customer = {};
		$scope.contact_list = [];
		$scope.card_list = [];
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

app.controller('CustomerSetupContactController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.addNewContact = function () {
		$scope.contact_list.push({ in_db: false, deleted: false });
	};

	$scope.removeContact = function (index) {
		$scope.contact_list[index].deleted = true;
	};

}]);

app.controller('CustomerSetupGLAccountsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	$scope.openGLAccountModal = function () {
		$("#SelectGLAccountModal").modal("show");
	};

	$scope.selectGLAccount = function (selected_glaccount) {
		$scope.customer.glaccount = selected_glaccount.id;
		$("#SelectGLAccountModal").modal("hide");
	};

}]);

app.controller('CustomerSetupNotepadController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {
	console.log("asd");
}]);

app.controller('CustomerSetupSettingsController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	$scope.customer_status_list = [
		{
			"status": "A",
			"description": "Active"
		},
		{
			"status": "I",
			"description": "Inactive"
		}
	];

	$scope.openRevenueModal = function () {
		$("#SelectRevenueModal").modal("show");
	};

	$scope.selectRevenue = function (selected_revenue) {
		$scope.customer.crevncode = selected_revenue.crevncode;
		$("#SelectRevenueModal").modal("hide");
	};

	$scope.openPaycodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (selected_paycode) {
		$scope.customer.cpaycode = selected_paycode.cpaycode;
		$("#SelectPaycodeModal").modal("hide");
	};

	$scope.openCurrencyModal = function () {
		$("#SelectCurrencyModal").modal("show");
	};

	$scope.selectCurrency = function (selected_currency) {
		$scope.customer.ccurrcode = selected_currency.ccurrcode;
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

app.controller('CustomerSetupInformationController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	$scope.openWarehouseModal = function () {
		$("#SelectWarehouseModal").modal("show");
	};

	$scope.selectWarehouse = function (selected_warehouse) {
		$scope.customer.cwarehouse = selected_warehouse.cwarehouse;
		$("#SelectWarehouseModal").modal("hide");
	};

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

}]);
