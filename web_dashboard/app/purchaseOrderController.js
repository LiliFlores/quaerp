app.controller('InvoiceSetupController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};
	$scope.invoice_method_list = ["add", "amend"];

	$rootScope.order_date_status = false;
	$rootScope.invoice_date_status = false;

	$scope.amend_invoice = {};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.$watch("invoice", function () {
		// console.log($scope.invoice);
	}, 1);

	$scope.$watch('invoice.items', function () {

		$scope.invoice.subtotal = 0;
		$scope.invoice.total_discount = 0;
		$scope.invoice.items.forEach(function (item, index) {
			if (!item.deleted) {
				$scope.invoice.subtotal += (item.shipqty * item.nprice);
				$scope.invoice.total_discount += (item.shipqty * item.nprice) * (item.discount / 100);
			}
		});

		$scope.invoice.subtotal = ($scope.invoice.subtotal).toFixed(2);
		$scope.invoice.total_discount = ($scope.invoice.total_discount).toFixed(2);

		$scope.calculateOverwriteSalesTax();
		$timeout(function () {
			$scope.calculateInvoiceTotal();
		});

	}, 1);

	$scope.invoice = {};
	$scope.invoice.items = [];
	// $scope.invoice.customer = {"id":"1","ccustno":"ACC1","ccompany":"Access Communications, Inc","caddr1":"3398 Lincoln Ave","caddr2":"Bldg. A","ccity":"San Rafael","cstate":"CA","czip":"94901","ccountry":"USA","cphone1":"415-258-0900","cphone2":null,"cfax":"415-256-8000","cemail":"monar@access.com","cfname":"Mona","clname":"Rice","cdear":null,"ctitle":"Manager","corderby":null,"cslpnno":"SARA","cstatus":"A","cclass":"SERVICE","cindustry":"COMMUNICAT","cterr":"W","cwarehouse":"MAIN","cpaycode":"2%10NET30","cbilltono":"A1","cshiptono":"A2","ctaxcode":"CA","crevncode":null,"cresaleno":"29-92876108","cpstno":null,"ccurrcode":"USD","cprtstmt":"O","caracc":"120100-000-00","crcalactn":null,"clcalactn":null,"cpasswd":null,"cecstatus":"N","cecaddress":null,"cpricecd":"2","dcreate":"01/01/2002 00:00:00","tmodified":"02/24/2002 00:00:00","trecall":"/  /","tlcall":"/  /","lprtstmt":"1","lfinchg":"1","liocust":"0","lusecusitm":"0","lgeninvc":"1","luselprice":"0","nexpdays":"0","ndiscrate":"45.00","natdsamt":"5303.00","ncrlimit":"30000.00","nsoboamt":"500.00","nopencr":"0.00","nbalance":"2005.00","created":null};
	// $scope.invoice = {"items":[{"shipqty":"1","discount":"0","id":"1","citemno":"006-00095","cdescript":"Jointing Stone HSS Profiling","ctype":"MAINT","cbarcode1":null,"cbarcode2":null,"cstatus":"A","cmeasure":null,"cclass":"MAINT","cprodline":"MAINT","ccommiss":null,"cvendno":null,"cimagepath":null,"dcreate":"8/25/2005 0:00","dlastsale":null,"dlastfnh":null,"dspstart":null,"dspend":null,"tmodified":"8/29/2016 10:09","laritem":"1","lpoitem":"1","lmiitem":"0","lioitem":"0","lowrevncd":"0","lkititem":"0","lowcomp":"0","ltaxable1":"0","ltaxable2":"0","lowdesc":"1","lowprice":"1","lowdisc":"0","lowtax":"0","lcomplst":"0","lchkonhand":"0","lupdonhand":"0","lallowneg":"0","lmlprice":"0","lowivrmk":"1","lptivrmk":"1","lowsormk":"0","lptsormk":"0","lowpormk":"1","lptpormk":"1","lowmirmk":"0","lptmirmk":"0","ncosttype":"1","nqtydec":"1","ndiscrate":"0","nweight":"0","nstdcost":"0.0000","nrtrncost":"0.0000","nlfnhcost":"0","nprice":"27.5000","nspprice":"0.000","nlsalprice":"0.0000","llot":"0","lsubitem":"0","lowweight":"0","lprtsn":"0","lprtlotno":"0","lusekitno":"0","lnegprice":"0","cspectype1":null,"cspectype2":null,"cminptype":"PC","lusespec":"0","nminprice":"0","lowcoms":"0","cbuyer":null,"ldiscard":"0","lrepair":"0","nrstkpct":"0","nrstkmin":"0","nrepprice":"0","llifetime":"0","lowrarmk":"0","lptrarmk":"0","created":null,"$$hashKey":"object:44"}],"customer":{"id":"1","ccustno":"ACC1","ccompany":"Access Communications, Inc","caddr1":"3398 Lincoln Ave","caddr2":"Bldg. A","ccity":"San Rafael","cstate":"CA","czip":"94901","ccountry":"USA","cphone1":"415-258-0900","cphone2":null,"cfax":"415-256-8000","cemail":"monar@access.com","cfname":"Mona","clname":"Rice","cdear":null,"ctitle":"Manager","corderby":null,"cslpnno":"SARA","cstatus":"A","cclass":"SERVICE","cindustry":"COMMUNICAT","cterr":"W","cwarehouse":"MAIN","cpaycode":"2%10NET30","cbilltono":"A1","cshiptono":"A2","ctaxcode":"CA","crevncode":null,"cresaleno":"29-92876108","cpstno":null,"ccurrcode":"USD","cprtstmt":"O","caracc":"120100-000-00","crcalactn":null,"clcalactn":null,"cpasswd":null,"cecstatus":"N","cecaddress":null,"cpricecd":"2","dcreate":"01/01/2002 00:00:00","tmodified":"02/24/2002 00:00:00","trecall":"/  /","tlcall":"/  /","lprtstmt":"1","lfinchg":"1","liocust":"0","lusecusitm":"0","lgeninvc":"1","luselprice":"0","nexpdays":"0","ndiscrate":"45.00","natdsamt":"5303.00","ncrlimit":"30000.00","nsoboamt":"500.00","nopencr":"0.00","nbalance":"2005.00","created":null,"$$hashKey":"object:34"},"corderby":"Erick Alvarez","freight":"0","adjustment":"0","subtotal":27.5,"total_discount":"0.00","sales_tax":{"id":"2","ctaxcode":"7.75","cdescript":"CA Sales Tax","centity2":null,"centity1":"CA","centity3":null,"cstaxacc1":"2300","cstaxacc2":null,"cstaxacc3":null,"ltaxontax":"0","ntaxrate1":"7.75","ntaxrate2":"0","ntaxrate3":"0","lgstcb":"0","lpstcb":"0","currency":"USA","created":null,"$$hashKey":"object:181"},"overwrite_sales_tax":"2.13","total":"29.63","warehouse":{"id":"1","cwarehouse":"MAIN","cdescript":"ALMACEN PRINCIPAL","caddr1":null,"caddr2":null,"ccity":null,"cstate":null,"czip":null,"ccountry":null,"cphone":null,"ccontact":null,"ctaxcode":null,"created":null,"$$hashKey":"object:70"},"address1":{"id":"1","ccustno":"ACC1","caddrno":"A1","ccompany":"Access Communications, Inc","caddr1":"3398 Lincoln Ave","caddr2":null,"ccity":"San Rafael","cstate":"CA","czip":"94901","ccountry":null,"cphone":"415-258-0900","ccontact":"Mona Rice","ctaxcode":null,"created":null,"$$hashKey":"object:145"},"address2":{"id":"2","ccustno":"ACC1","caddrno":"A2","ccompany":"Access Communications","caddr1":"3398 Lincoln Ave","caddr2":"Bldg. F","ccity":"San Rafael","cstate":"CA","czip":"94901","ccountry":"USA","cphone":"415-258-0900","ccontact":"Mona Rice","ctaxcode":null,"created":null,"$$hashKey":"object:146"},"currency":"0.061","ship_via":{"id":"1","description":"Ground","trevacc":"4410","taxable1":"0","taxable2":"0","created":null,"$$hashKey":"object:62"},"fob":{"id":"1","code":"SD","description":"SanDiego","created":null,"$$hashKey":"object:69"},"cpono":"asdfasdf","salesperson":{"id":"2","cslpnno":"DJ","cname":"DAVE JOHNSON","ctitle":"Sales Rep","caddr1":null,"caddr2":null,"cstate":null,"ccity":null,"czip":null,"ccountry":null,"cphone":null,"cstatus":"A","dcreate":"15-Aug-08 00:00:00","crevncode":null,"created":null,"$$hashKey":"object:104"},"sono":"12342134","sidemarkno":"78907890","remark":{"id":"1","code":"asd1","remarks":"lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum","created":null,"$$hashKey":"object:87"},"notepad":"My notepad"};
	$scope.invoice.corderby = $rootScope.logged_user.name;

	if (typeof ($scope.invoice.freight) == "undefined") {
		$scope.invoice.freight = 0;
	}
	if (typeof ($scope.invoice.adjustment) == "undefined") {
		$scope.invoice.adjustment = 0;
	}

	$scope.tax_rate2 = 0;
	$scope.tax_rate3 = 0;
	$scope.tax_amount2 = 0;
	$scope.tax_amount3 = 0;
	// $scope.tax_amount1 = 0;
	$scope.tax_rate_total = 0;
	$scope.tax_amount_total = 0;

	$scope.customer_list = [];
	$scope.fob_list = [];
	$scope.warehouse_list = [];
	$scope.shipvia_list = [];
	$scope.salesperson_list = [];
	$scope.remark_list = [];
	$scope.item_list = [];
	$scope.paycode_list = [];
	$scope.cusaddr_list = [];
	$scope.saletax_list = [];
	$scope.exchangerate_list = [];

	var customer_prom = GenericFactory.get("arcust", "", custom_headers);
	var fob_prom = GenericFactory.get("arfob", "", custom_headers);
	var warehouse_prom = GenericFactory.get("arwhse", "", custom_headers);
	var shipvia_prom = GenericFactory.get("arfrgt", "", custom_headers);
	var salesperson_prom = GenericFactory.get("arslpn", "", custom_headers);
	var remark_prom = GenericFactory.get("arirmk", "", custom_headers);
	var item_prom = GenericFactory.get("icitem", "limit/3", custom_headers);

	var type_prom = GenericFactory.get("ictype", "limit/3", custom_headers);

	var paycode_prom = GenericFactory.get("arpycd", "", custom_headers);
	var cusaddr_prom = GenericFactory.get("arcadr", "", custom_headers);
	var saletax_prom = GenericFactory.get("costax", "", custom_headers);
	var exchangerate_prom = GenericFactory.get("cocurr", "", custom_headers);


	customer_prom.then(function (response) {
		if (response.status) {
			$scope.customer_list = response.results;
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

		return salesperson_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.salesperson_list = response.results;
		}

		return remark_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.remark_list = response.results;
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

		return exchangerate_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.exchangerate_list = response.results;
		}

		// TEST
		$scope.updateCustomerData();
	});

	$scope.changeInvoiceMode = function () {
		if ($scope.invoice_action == "amend") {
			$scope.invoice = {
				"items": []
			};
		}
	};

	$scope.updateCustomerData = function () {

		if (typeof ($scope.invoice.customer) != "undefined") {
			let customer = angular.copy($scope.invoice.customer);

			$scope.invoice.warehouse = {};
			$scope.invoice.address1 = {};
			$scope.invoice.address2 = {};
			$scope.invoice.sales_tax = {};
			$scope.invoice.cresaleno = "";
			$scope.invoice.cresaleno = $scope.invoice.customer.cresaleno;
			$scope.invoice.corderby = $scope.invoice.customer.corderby;

			// Load default warehouse
			$scope.warehouse_list.forEach(function (warehouse) {
				if (customer.cwarehouse == warehouse.cwarehouse) {
					$scope.invoice.warehouse = warehouse;
					return;
				}
			});

			// Load default address 1 & 2
			var selected_both_address = false;
			$scope.cusaddr_list.forEach(function (address) {
				selected_both_address = false;
				if (customer.cbilltono == address.caddrno && customer.ccustno == address.ccustno) {
					$scope.invoice.address1 = address;
				}

				if (customer.cshiptono == address.caddrno && customer.ccustno == address.ccustno) {
					$scope.invoice.address2 = address;
				}

				if (selected_both_address) {
					return;
				}
			});

			// Load default Sales Tax
			$scope.saletax_list.forEach(function (saletax) {
				if (customer.ctaxcode == saletax.centity1) {
					$scope.invoice.sales_tax = saletax;
					return;
				}
			});

			// Load default exchange rate
			$scope.exchangerate_list.forEach(function (exchange_rate) {
				if (customer.ccurrcode == exchange_rate.ccurrcode) {
					$scope.invoice.currency = exchange_rate.nxchgrate;
					return;
				}
			});
		}

	};

	$scope.calculateOverwriteSalesTax = function () {

		$timeout(function () {
			if (typeof ($scope.invoice.sales_tax) == "undefined") {
				$scope.invoice.sales_tax = {};
				$scope.invoice.sales_tax.ntaxrate1 = 0;
			}
			$scope.tax_rate1 = parseFloat($scope.invoice.sales_tax.ntaxrate1);
			$scope.tax_amount1 = ($scope.invoice.subtotal - $scope.invoice.total_discount) * (parseFloat($scope.invoice.sales_tax.ntaxrate1) / 100);

			$scope.tax_rate_total = $scope.tax_rate1 + $scope.tax_rate2 + $scope.tax_rate3;
			$scope.tax_amount_total = $scope.tax_amount1 + $scope.tax_amount2 + $scope.tax_amount3;

			$scope.invoice.overwrite_sales_tax = $scope.tax_amount_total;

			$scope.invoice.overwrite_sales_tax = $scope.invoice.overwrite_sales_tax.toFixed(2);
		});
	};

	$scope.calculateInvoiceTotal = function () {
		$scope.invoice.total = ($scope.invoice.subtotal - $scope.invoice.total_discount + parseFloat($scope.invoice.overwrite_sales_tax) + parseFloat($scope.invoice.freight) + parseFloat($scope.invoice.adjustment)).toFixed(2);
	};


	// Invoice manager toolbar [ Save ] [ Void ] [ Copy ] [ Clear ] [ Close ] [ Print ]

	$scope.saveInvoice = function () {

		if (!$rootScope.order_date_status || !$rootScope.invoice_date_status) {
			swal({
				title: "Invoice error!",
				text: "Please, check order date or invoice date.",
				type: "error"
			});
			return;
		}

		switch ($scope.invoice_action) {
			case "add":


				var invoice = angular.copy($scope.invoice);
				var payload = {};

				var arsyst_prom = GenericFactory.get("arsyst", "", custom_headers);

				arsyst_prom.then(function (response) {
					if (response.status) {

						payload.active = true;
						payload.cinvno = parseInt(response.results[0].next_invoice);
						payload.cwarehouse = ((typeof (invoice.warehouse) != "undefined") ? invoice.warehouse.cwarehouse : null);
						payload.cpaycode = invoice.customer.cpaycode;
						payload.sidemarkno = invoice.sidemarkno;
						payload.sono = invoice.sono;
						payload.corderby = invoice.corderby;
						payload.cslpnno = ((typeof (invoice.salesperson) != "undefined") ? invoice.salesperson.cslpnno : null);
						payload.cshipvia = ((typeof (invoice.ship_via) != "undefined") ? invoice.ship_via.description : null);
						payload.cfob = ((typeof (invoice.fob) != "undefined") ? invoice.fob.code : null);
						payload.cpono = invoice.cpono;
						payload.dorder = invoice.dorder;
						payload.dinvoice = invoice.dinvoice;
						payload.remark = ((typeof (invoice.remark) != "undefined") ? invoice.remark.code : null);

						var create_remark = true;
						$scope.remark_list.forEach(function (remark) {
							if (remark.code == payload.remark) {
								create_remark = false;
								return;
							}
						});

						if (create_remark) {
							GenericFactory.post("arirmk", invoice.remark, custom_headers);
						}

						payload.costax = ((typeof (invoice.sales_tax) != "undefined") ? invoice.sales_tax.id : null);
						payload.nxchgrate = invoice.currency;
						payload.nfsalesamt = invoice.subtotal;
						payload.nfdiscamt = invoice.total_discount;
						payload.nftaxamt1 = invoice.overwrite_sales_tax;
						payload.nfbalance = invoice.total;
						payload.nffrtamt = invoice.freight;

						payload.ntaxamt1 = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nftaxamt1)).toFixed(2);
						payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfdiscamt)).toFixed(2);
						payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfsalesamt)).toFixed(2);
						payload.nfrtamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nffrtamt)).toFixed(2);
						payload.nbalance = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfbalance)).toFixed(2);

						payload.ccustno = invoice.customer.ccustno;
						payload.ccurrcode = invoice.customer.ccurrcode;
						payload.cresaleno = invoice.cresaleno;
						payload.nadjamt = invoice.adjustment;

						payload.cbcompany = invoice.address1.ccompany;
						payload.cbaddr1 = invoice.address1.caddr1;
						payload.cbaddr2 = invoice.address1.caddr2;
						payload.cbcity = invoice.address1.ccity;
						payload.cbstate = invoice.address1.cstate;
						payload.cbzip = invoice.address1.czip;
						payload.cbcountry = invoice.address1.ccountry;
						payload.cbphone = invoice.address1.cphone;
						payload.cbcontact = invoice.address1.ccontact;

						payload.cscompany = invoice.address2.ccompany;
						payload.csaddr1 = invoice.address2.caddr1;
						payload.csaddr2 = invoice.address2.caddr2;
						payload.cscity = invoice.address2.ccity;
						payload.csstate = invoice.address2.cstate;
						payload.cszip = invoice.address2.czip;
						payload.cscountry = invoice.address2.ccountry;
						payload.csphone = invoice.address2.cphone;
						payload.cscontact = invoice.address2.ccontact;

						payload.notepad = invoice.notepad;

						var new_invoice_prom = GenericFactory.post("arinvoice", payload, custom_headers);
						new_invoice_prom.then(function (response) {
							if (response.status) {

								invoice.items.forEach(function (item) {
									var invoice_item_payload = {};
									invoice_item_payload.ccustno = payload.ccustno;
									invoice_item_payload.cwarehouse = payload.cwarehouse;
									invoice_item_payload.cinvno = payload.cinvno;
									invoice_item_payload.citemno = item.citemno;
									invoice_item_payload.cdescript = item.cdescript;
									invoice_item_payload.ndiscrate = parseFloat(item.discount);
									invoice_item_payload.nordqty = parseFloat(item.shipqty);
									invoice_item_payload.nshipqty = parseFloat(item.shipqty);
									invoice_item_payload.nfprice = parseFloat(item.nprice);
									invoice_item_payload.nfsalesamt = parseFloat(item.nprice) * parseFloat(item.shipqty);
									invoice_item_payload.nfdiscamt = (parseFloat(item.nprice) * parseFloat(item.shipqty) * parseFloat(item.discount) / 100);
									invoice_item_payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfsalesamt).toFixed(2);
									invoice_item_payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfdiscamt).toFixed(2);
									invoice_item_payload.nprice = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfprice).toFixed(2);

									GenericFactory.post("aritrs", invoice_item_payload, custom_headers);
								});

								var arsyst_payload = {
									"id": 1,
									"next_invoice": payload.cinvno + 1
								};
								var arsyst_next_invoice_prom = GenericFactory.put("arsyst", arsyst_payload, custom_headers);
								arsyst_next_invoice_prom.then(function (response) {
									if (response.status) {
										let message = "You have added Invoice #{0}".format(payload.cinvno);

										swal({
											title: "Success!",
											text: message,
											type: "success"
										});

										$scope.invoice = {
											"items": []
										};
										$state.go("ar_invoice_setup");

										GenericFactory.get("arirmk", "", custom_headers).then(function (response) {
											if (response.status) {
												$scope.remark_list = response.results;
											}
										});
									} else {
										console.log(response);
										swal({
											title: "Error!",
											text: "Please, contact admin.",
											type: "error"
										});
									}
								});
							} else {
								swal({
									title: "Error!",
									text: "There is a problem adding the invoice, maybe the invoice # is already used in another invoice. Please, contact admin.",
									type: "error"
								});
							}
						});
					}
				});

				break;

			case "amend":
				var invoice = angular.copy($scope.invoice);
				var payload = {};

				payload.id = invoice.id;
				payload.cwarehouse = ((typeof (invoice.warehouse) != "undefined") ? invoice.warehouse.cwarehouse : null);
				payload.cpaycode = invoice.customer.cpaycode;
				payload.sidemarkno = invoice.sidemarkno;
				payload.sono = invoice.sono;
				payload.corderby = invoice.corderby;
				payload.cslpnno = ((typeof (invoice.salesperson) != "undefined") ? invoice.salesperson.cslpnno : null);
				payload.cshipvia = ((typeof (invoice.ship_via) != "undefined") ? invoice.ship_via.description : null);
				payload.cfob = ((typeof (invoice.fob) != "undefined") ? invoice.fob.code : null);
				payload.cpono = invoice.cpono;
				payload.dorder = invoice.dorder;
				payload.dinvoice = invoice.dinvoice;
				payload.remark = ((typeof (invoice.remark) != "undefined") ? invoice.remark.code : null);

				var create_remark = true;
				$scope.remark_list.forEach(function (remark) {
					if (remark.code == payload.remark) {
						create_remark = false;
						return;
					}
				});

				if (create_remark) {
					GenericFactory.post("arirmk", invoice.remark, custom_headers);
				}

				payload.costax = ((typeof (invoice.sales_tax) != "undefined") ? invoice.sales_tax.id : null);
				payload.nxchgrate = invoice.currency;
				payload.nfsalesamt = invoice.subtotal;
				payload.nfdiscamt = invoice.total_discount;
				payload.nftaxamt1 = invoice.overwrite_sales_tax;
				// payload.nfbalance = invoice.total;
				payload.nffrtamt = invoice.freight;

				payload.ntaxamt1 = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nftaxamt1)).toFixed(2);
				payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfdiscamt)).toFixed(2);
				payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfsalesamt)).toFixed(2);
				payload.nfrtamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nffrtamt)).toFixed(2);
				// payload.nbalance = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfbalance)).toFixed(2);

				payload.ccustno = invoice.customer.ccustno;
				payload.ccurrcode = invoice.customer.ccurrcode;
				payload.nadjamt = invoice.adjustment;

				payload.cbcompany = invoice.address1.ccompany;
				payload.cbaddr1 = invoice.address1.caddr1;
				payload.cbaddr2 = invoice.address1.caddr2;
				payload.cbcity = invoice.address1.ccity;
				payload.cbstate = invoice.address1.cstate;
				payload.cbzip = invoice.address1.czip;
				payload.cbcountry = invoice.address1.ccountry;
				payload.cbphone = invoice.address1.cphone;
				payload.cbcontact = invoice.address1.ccontact;

				payload.cscompany = invoice.address2.ccompany;
				payload.csaddr1 = invoice.address2.caddr1;
				payload.csaddr2 = invoice.address2.caddr2;
				payload.cscity = invoice.address2.ccity;
				payload.csstate = invoice.address2.cstate;
				payload.cszip = invoice.address2.czip;
				payload.cscountry = invoice.address2.ccountry;
				payload.csphone = invoice.address2.cphone;
				payload.cscontact = invoice.address2.ccontact;

				payload.notepad = invoice.notepad;

				var new_invoice_prom = GenericFactory.put("arinvoice", payload, custom_headers);
				new_invoice_prom.then(function (response) {
					if (response.status) {

						var update_item_prom_list = [];
						invoice.items.forEach(function (item) {
							var invoice_item_payload = {};
							invoice_item_payload.id = item.id;
							invoice_item_payload.ccustno = payload.ccustno;
							invoice_item_payload.cwarehouse = payload.cwarehouse;
							invoice_item_payload.cinvno = invoice.cinvno;
							invoice_item_payload.citemno = item.citemno;
							invoice_item_payload.cdescript = item.cdescript;
							invoice_item_payload.ndiscrate = parseFloat(item.discount);
							invoice_item_payload.nordqty = parseFloat(item.shipqty);
							invoice_item_payload.nshipqty = parseFloat(item.shipqty);
							invoice_item_payload.nfprice = parseFloat(item.nprice);
							invoice_item_payload.nfsalesamt = parseFloat(item.nprice) * parseFloat(item.shipqty);
							invoice_item_payload.nfdiscamt = (parseFloat(item.nprice) * parseFloat(item.shipqty) * parseFloat(item.discount) / 100);
							invoice_item_payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfsalesamt).toFixed(2);
							invoice_item_payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfdiscamt).toFixed(2);
							invoice_item_payload.nprice = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfprice).toFixed(2);

							if (item.to_update) {
								if (item.deleted) {
									GenericFactory.delete("aritrs", invoice_item_payload.id, custom_headers);
								} else {
									GenericFactory.put("aritrs", invoice_item_payload, custom_headers);
								}
							} else {
								GenericFactory.post("aritrs", invoice_item_payload, custom_headers);
							}
						});

						$scope.invoice = {
							"items": []
						};
						$state.go("ar_invoice_setup");
						swal({
							title: "Success!",
							text: "Invoice successfully updated",
							type: "success"
						});
					}
				});



			default:

		}

	};

	$scope.searchInvoice = function () {
		var invoice_no = $scope.amend_invoice.invoice_to_search;

		var original_invoice = {};
		original_invoice.items = [];

		var search_query = "cinvno/{0}".format(invoice_no);
		var search_invoice_prom = GenericFactory.get("arinvoice", search_query, custom_headers);
		var invoice_items_prom = GenericFactory.get("aritrs", "limit/-1", custom_headers);

		search_invoice_prom.then(function (response) {
			if (response.status) {
				original_invoice = angular.extend(original_invoice, response.results[0]);
			}

			return invoice_items_prom;
		}).then(function (response) {
			if (response.status) {
				response.results.forEach(function (item) {
					if (item.cinvno == original_invoice.cinvno) {
						original_invoice.items.push(item);
					}
				});
			}

			var invoice = {};
			invoice.items = [];
			$scope.warehouse_list.forEach(function (warehouse) {
				if (original_invoice.cwarehouse == warehouse.cwarehouse) {
					invoice.warehouse = warehouse;
					return;
				}
			});
			$scope.salesperson_list.forEach(function (salesperson) {
				if (original_invoice.cslpnno == salesperson.cslpnno) {
					invoice.salesperson = salesperson;
					return;
				}
			});
			$scope.shipvia_list.forEach(function (ship_via) {
				if (original_invoice.cshipvia == ship_via.description) {
					invoice.ship_via = ship_via;
					return;
				}
			});
			$scope.fob_list.forEach(function (fob) {
				if (original_invoice.cfob == fob.code) {
					invoice.fob = fob;
					return;
				}
			});
			$scope.remark_list.forEach(function (remark) {
				if (original_invoice.remark == remark.code) {
					invoice.remark = remark;
					return;
				}
			});
			$scope.saletax_list.forEach(function (sales_tax) {
				if (original_invoice.costax == sales_tax.id) {
					invoice.sales_tax = sales_tax;
					return;
				}
			});
			$scope.customer_list.forEach(function (customer) {
				if (original_invoice.ccustno == customer.ccustno) {
					invoice.customer = customer;
					return;
				}
			});

			invoice.id = original_invoice.id;
			invoice.active = original_invoice.active;
			invoice.cinvno = original_invoice.cinvno;
			invoice.sono = original_invoice.sono;
			invoice.sidemarkno = original_invoice.sidemarkno;
			invoice.corderby = original_invoice.corderby;
			invoice.cpono = original_invoice.cpono;
			invoice.cresaleno = invoice.customer.cresaleno;

			invoice.dorder = original_invoice.dorder;
			$("#invoice_order_date").val(original_invoice.dorder);
			invoice.dinvoice = original_invoice.dinvoice;
			$("#invoice_invoice_date").val(original_invoice.dinvoice);
			$rootScope.order_date_status = true;
			$rootScope.invoice_date_status = true;

			invoice.currency = original_invoice.nxchgrate;
			invoice.subtotal = parseFloat(original_invoice.nfsalesamt).toFixed(2);
			invoice.total_discount = original_invoice.nfdiscamt;
			invoice.overwrite_sales_tax = original_invoice.nftaxamt1;
			invoice.total = original_invoice.nfbalance;
			invoice.freight = original_invoice.nffrtamt;

			invoice.adjustment = original_invoice.nadjamt;

			invoice.address1 = {};
			invoice.address1.ccompany = original_invoice.cbcompany;
			invoice.address1.caddr1 = original_invoice.cbaddr1;
			invoice.address1.caddr2 = original_invoice.cbaddr2;
			invoice.address1.ccity = original_invoice.cbcity;
			invoice.address1.cstate = original_invoice.cbstate;
			invoice.address1.czip = original_invoice.cbzip;
			invoice.address1.ccountry = original_invoice.cbcountry;
			invoice.address1.cphone = original_invoice.cbphone;
			invoice.address1.ccontact = original_invoice.cbcontact;

			invoice.address2 = {};
			invoice.address2.ccompany = original_invoice.cscompany;
			invoice.address2.caddr1 = original_invoice.csaddr1;
			invoice.address2.caddr2 = original_invoice.csaddr2;
			invoice.address2.ccity = original_invoice.cscity;
			invoice.address2.cstate = original_invoice.csstate;
			invoice.address2.czip = original_invoice.cszip;
			invoice.address2.ccountry = original_invoice.cscountry;
			invoice.address2.cphone = original_invoice.csphone;
			invoice.address2.ccontact = original_invoice.cscontact;

			invoice.notepad = original_invoice.notepad;

			original_invoice.items.forEach(function (original_item) {
				var item = {};
				item.id = original_item.id;
				item.to_update = true; // flag to indicate that this item its already created in DB (aritrs)
				item.deleted = false; // flag to indicate that if in save we will delete this item
				item.citemno = original_item.citemno;
				item.cdescript = original_item.cdescript;
				item.shipqty = original_item.nshipqty;
				item.nprice = original_item.nfprice;
				item.discount = original_item.ndiscrate;
				// item.extended = ((item.shipqty * item.nprice) - ((item.shipqty * item.nprice) * (item.discount / 100))).toFixed(2);

				invoice.items.push(item);
			});

			$scope.invoice = invoice;

		});
	};

	$scope.deleteInvoice = function () {
		var payload = {
			"id": $scope.invoice.id,
			"active": 0
		};
		GenericFactory.put("arinvoice", payload, custom_headers).then(function (response) {
			if (response.status) {
				swal({
					title: "Success!",
					text: "Invoice deleted successfully",
					type: "success"
				});
			}
		});
	};

	$scope.clearInvoice = function () {
		$scope.invoice = {
			"items": []
		};
		$state.go("ar_invoice_setup");
	};

}]);

app.controller('InvoiceSetupNotepadController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = true;
}]);

app.controller('InvoiceSetupLineItemsController', ["$scope", "$rootScope", "$state", "$timeout", "GenericFactory", function ($scope, $rootScope, $state, $timeout, GenericFactory) {

	$rootScope.enable_print_invoice_preview = true;

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.current_item_to_search = {};

	// Object to show extra info
	$scope.selected_item = {};

	$scope.addEmptyItem = function () {
		$scope.invoice.items.push({
			"discount": 0,
			"shipqty": 1
		});
	};

	$scope.searchStockItem = function (table_row_item) {

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

		$scope.invoice.items[$index].deleted = true;
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

app.controller('InvoiceSetupInformationController', ["$scope", "$rootScope", function ($scope, $rootScope) {
	$rootScope.enable_print_invoice_preview = true;


	$scope.openSalesPersonModal = function () {
		$("#SelectSalesPersonModal").modal("show");
	};

	$scope.selectSalesPerson = function (salesperson) {
		$scope.invoice.salesperson = salesperson;
		$("#SelectSalesPersonModal").modal("hide");
	};

	$scope.openRemarkModal = function () {
		$("#SelectRemarkModal").modal("show");
	};

	$scope.selectRemark = function (remark) {
		$scope.invoice.remark = remark;
		$("#SelectRemarkModal").modal("hide");
	};

	// Plugins
	$("#ship_via_select").select2();
	$("#fob_select").select2();
	$("#warehouse_select").select2();
	$("#remark_select").select2();


	$('#invoice_order_date').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});
	$('#invoice_invoice_date').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});

}]);

app.controller('InvoiceSetupPaymentController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = true;


	$scope.openPayCodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (paycode) {
		$scope.invoice.customer.cpaycode = paycode.cpaycode;
		$scope.invoice.cbankno = paycode.cbankno;
		$("#SelectPaycodeModal").modal("hide");
	};

	$scope.openAddressModal = function (n_address) {
		$scope.selecting_address_n = n_address;
		$("#SelectAddressModal").modal("show");
	};

	$scope.selectAddress = function (address) {
		if ($scope.selecting_address_n == 1) {
			$scope.invoice.address1 = address;
		} else {
			$scope.invoice.address2 = address;
		}
		$("#SelectAddressModal").modal("hide");
	};

	$scope.openTaxModal = function () {
		$("#SelectSaleTaxModal").modal("show");
	};

	$scope.selectTax = function (tax) {
		$scope.invoice.sales_tax = tax;
		$("#SelectSaleTaxModal").modal("hide");
	};

	// $scope.openCardModal = function() {
	//     $("#selectCardModal").modal("show");
	// };
	//
	// $scope.selectCard = function(card) {
	//     $scope.invoice.card = card;
	//     $("#selectCardModal").modal("hide");
	// };
	//
	// $scope.openAddressModal = function(n_address) {
	//     $scope.selecting_address_n = n_address;
	//     $("#selectAddressModal").modal("show");
	// };
	//
	// $scope.selectAddress = function(address) {
	//     if ($scope.selecting_address_n == 1) {
	//         $scope.invoice.address1 = address;
	//     } else {
	//         $scope.invoice.address2 = address;
	//     }
	//     $("#selectAddressModal").modal("hide");
	// };
	//


}]);

app.controller('ArSetupFinanceChargeController', ["$scope", "$rootScope", "GenericFactory", "$state", function ($scope, $rootScope, GenericFactory, $state) {
	// Browser title
	$rootScope.page_title = "Setup Finance Charge";

	$('[ui-sref="ar_setup_finance_charge"]').toggleClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_1"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_2"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_gl_accounts"]').removeClass("ar-menu-active");

	$scope.arsyst = {};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

	arsyst_prom.then(function (response) {
		$scope.arsyst = response.results[0];
	});

	$scope.updateArsystSettingsFinanceCharge = function () {

		var payload = $scope.arsyst;

		delete payload.arfob;
		delete payload.arfrgt;
		delete payload.arpycd;
		delete payload.arwhse;
		delete payload.arrevn;

		GenericFactory.put("arsyst", payload, custom_headers).then(function (response) {
			if (response.status) {
				alertify.success("Settings have succesfully been updated");
			} else {
				alertify.error("Error, please contact admin");
				console.log(response);
			}
		});
	};

}]);

app.controller('InvoicePreviewController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {

	$rootScope.enable_print_invoice_preview = false;

}]);


app.controller('ImportInvoiceController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {


	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, "");
	};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.ship_via_list = [];
	GenericFactory.get("arfrgt", "", custom_headers).then(function (response) {
		if (response.status) {
			$scope.ship_via_list = response.results;
		}
	});

	$scope.customer_list = [];
	GenericFactory.get("arcust", "", custom_headers).then(function (response) {
		if (response.status) {
			$scope.customer_list = response.results;
		}
	});

	$scope.currency_list = [];
	GenericFactory.get("cocurr", "", custom_headers).then(function (response) {
		$scope.currency_list = response.results;
	});

	$scope.costax_list = [];
	GenericFactory.get("costax", "", custom_headers).then(function (response) {
		if (response.status) {
			$scope.costax_list = response.results;
		}
	});


	$scope.clickOnFileInput = function () {
		$("#fileInput").trigger("click");
	}

	$scope.current_file_name = "";

	$scope.valid_invoice_count = 0;
	$scope.invalid_invoice_count = 0;

	$scope.processInvoiceImportFile = function (file_content) {

		$scope.selected_invoice_items = [];

		$scope.invoice_list = [];

		$scope.valid_invoice_list = [];
		$scope.invalid_invoice_list = [];

		$scope.invoice = {};
		$scope.invoice.items = [];
		$scope.invoice.error_message = [];

		var inv_list = file_content.split("\n");
		inv_list.splice(inv_list.indexOf(""), 1);

		var current_invoice_no = "";
		inv_list.forEach(function (invoice, index) {
			var current_invoice = invoice.split(",");

			if (current_invoice[0] == "*") {

				var customer = current_invoice[1];
				var customer_found = false;

				$scope.customer_list.forEach(function (cust, index) {
					if (cust.ccustno == customer) {
						$scope.invoice.customer = cust;

						$scope.currency_list.forEach(function (currency) {
							if (currency.ccurrcode == cust.ccurrcode) {
								$scope.invoice.currency = currency.nxchgrate;
							}
						});

						$scope.invoice.address1 = {
							"ccompany": cust.ccompany,
							"caddr1": cust.caddr1,
							"caddr2": cust.caddr2,
							"ccity": cust.ccity,
							"cstate": cust.cstate,
							"czip": cust.czip,
							"ccountry": cust.ccountry,
							"cphone": cust.cphone1,
							"ccontact": ""
						};
						$scope.invoice.address2 = $scope.invoice.address1;
						$scope.invoice.remark = {
							"code": "",
							"remarks": ""
						};
						$scope.invoice.arwhse = {
							"cwarehouse": cust.cwarehouse
						};
						// corderby
						$scope.invoice.corderby = "";
						$scope.invoice.sales_person = {
							"id": ""
						};
						$scope.invoice.total_discount = 10;
						$scope.invoice.freight = 0;
						$scope.invoice.overwrite_sales_tax = 0;
						$scope.invoice.adjustment = 0;
						$scope.invoice.ship_via = {
							"id": "",
							"description": ""
						};
						$scope.invoice.fob = {
							"id": ""
						};

						$scope.invoice.notepad = "";

						customer_found = true;
						// return;
					}
				});

				current_invoice_no = current_invoice[2];
				$scope.invoice.next_invoice = current_invoice[2];
				$scope.invoice.order_date = current_invoice[6];
				$scope.invoice.invoice_date = current_invoice[6];
				$scope.invoice.zono = current_invoice[7];
				// $scope.invoice.sono = current_invoice[7];
				$scope.invoice.zidemarkno = current_invoice[8];
				// $scope.invoice.sidemarkno = "asd";
				if (customer_found) {
					$scope.invoice.cpono = current_invoice[4];

					$scope.ship_via_list.every(function (ship_via, index) {
						if (ship_via.id == current_invoice[5]) {
							$scope.invoice.ship_via = ship_via;
						}
					});

					// console.log($scope.invoice.sono);
					// console.log(current_invoice);
				} else {
					// console.log($scope.invoice.error_message);
				}

			} else {
				var item = {};
				var current_item = invoice.split(",");
				if (current_item[1] == current_invoice_no) {
					item.citemno = current_item[2];
					item.cdescript = current_item[3];
					item.discount = parseFloat(current_item[4]);
					item.shipqty = parseFloat(current_item[5]);
					item.nprice = parseFloat(current_item[6]);

					$scope.invoice.items.push(item);
				}

				if (typeof (inv_list[index + 1]) != "undefined") {
					var next_line = inv_list[index + 1].split(",");
					if (next_line[0] == "*") {
						// console.log($scope.invoice);
						$scope.invoice_list.push($scope.invoice);
						$scope.invoice = {};
						$scope.invoice.items = [];
						$scope.invoice.error_message = [];
					}
				} else {
					// console.log($scope.invoice);
					$scope.invoice_list.push($scope.invoice);
					$scope.invoice = {};
					$scope.invoice.items = [];
				}
			}
		});

		$scope.validateInvoiceList();
	};

	$scope.validateInvoiceList = function () {

		var invoice_n_list = [];
		var valid_invoices = [];
		var invalid_invoices = [];
		$scope.invoice_list.forEach(function (invoice, index) {
			// console.log(invoice);
			if (invoice_n_list.indexOf(invoice.next_invoice) == -1) {
				var is_valid = true;

				if (typeof (invoice.customer) != "object") {
					is_valid = false;
					invoice.error_message.push("Invalid Customer.");
				}
				if (invoice.next_invoice == "") {
					is_valid = false;
					invoice.error_message.push("Invoice # needed.");
				}
				if (invoice.cpono == "") {
					is_valid = false;
					invoice.error_message.push("Cpono # needed.");
				}
				if (invoice.sono = "") {
					is_valid = false;
					invoice.error_message.push("Sono # needed.");
				}
				if (invoice.sidemarkno = "") {
					is_valid = false;
					invoice.error_message.push("Sidemark # needed.");
				}

				invoice.nfsalesamt = 0;
				invoice.nfdiscamt = 0;
				invoice.items.forEach(function (item, index) {
					// subtotal
					invoice.nfsalesamt += (item.shipqty * item.nprice);
					// total_discount
					invoice.nfdiscamt += (item.shipqty * item.nprice) * (item.discount / 100);

					if (!item.citemno) {
						is_valid = false;
						invoice.error_message.push("Items # is needed.");
					}
					if (!item.shipqty) {
						is_valid = false;
						if (item.citemno) {
							invoice.error_message.push("Item: {0} ship quantity is needed.".format(item.citemno));
						} else {
							invoice.error_message.push("Items ship quantity is needed.");
						}
					}
					if (!item.nprice) {
						is_valid = false;

						if (item.citemno) {
							invoice.error_message.push("Item: {0} price is needed.".format(item.citemno));
						} else {
							invoice.error_message.push("Items price is needed.");
						}
					}
				});


				invoice.nfbalance = (invoice.nfsalesamt - invoice.nfdiscamt).toFixed(2);

				if (is_valid) {
					valid_invoices.push(invoice);
				} else {
					invalid_invoices.push(invoice);
				}

				invoice_n_list.push(invoice.next_invoice);
			} else {
				// console.log("D:");
			}

		});

		$scope.valid_invoice_list = valid_invoices;
		$scope.invalid_invoice_list = invalid_invoices;

		$scope.valid_invoice_count = $scope.valid_invoice_list.length;
		$scope.invalid_invoice_count = $scope.invalid_invoice_list.length;
		// console.log($scope.invalid_invoice_list);

		// console.log($scope.invoice_list);
	};

	$scope.fileChanged = function () {
		var reader = new FileReader();
		reader.onload = function (e) {
			$scope.$apply(function () {
				$scope.processInvoiceImportFile(reader.result);
			});
		};

		var txtFileInput = document.getElementById('fileInput');
		var txtFile = txtFileInput.files[0];
		if (typeof (txtFile) != "undefined") {
			$scope.current_file_name = txtFile.name;
			reader.readAsText(txtFile);
		}
	};

	$scope.addInvoices = function () {
		$scope.valid_invoice_list.forEach(function (invoice, index) {

			var payload = {};

			payload.active = true;
			payload.cinvno = invoice.next_invoice;
			payload.cwarehouse = invoice.arwhse.cwarehouse;
			payload.sidemarkno = invoice.zidemarkno;
			payload.sono = invoice.zono;
			payload.corderby = invoice.corderby;
			payload.cslpnno = invoice.sales_person.id;
			payload.cshipvia = invoice.ship_via.description;
			payload.cfob = invoice.fob.id;
			payload.cpono = invoice.cpono;
			payload.dorder = invoice.order_date;
			payload.dinvoice = invoice.invoice_date;
			payload.remark = invoice.remark.code;
			payload.costax = invoice.customer.ctaxcode;
			payload.nxchgrate = invoice.currency;

			payload.nfsalesamt = 0;
			payload.nfdiscamt = 0;
			invoice.items.forEach(function (item) {
				// subtotal
				payload.nfsalesamt += (item.shipqty * item.nprice);

				// total_discount
				payload.nfdiscamt += (item.shipqty * item.nprice) * (item.discount / 100);
			});


			payload.nftaxamt1 = invoice.overwrite_sales_tax;
			payload.nffrtamt = invoice.freight;
			payload.nadjamt = invoice.adjustment;
			payload.nfbalance = invoice.nfbalance;


			payload.ntaxamt1 = ((1 / parseFloat(payload.nxchgrate)) * parseFloat(payload.nftaxamt1)).toFixed(2);
			payload.ndiscamt = ((1 / parseFloat(payload.nxchgrate)) * parseFloat(payload.nfdiscamt)).toFixed(2);
			payload.nsalesamt = ((1 / parseFloat(payload.nxchgrate)) * parseFloat(payload.nfsalesamt)).toFixed(2);
			payload.nfrtamt = ((1 / parseFloat(payload.nxchgrate)) * parseFloat(payload.nffrtamt)).toFixed(2);
			payload.nbalance = ((1 / parseFloat(payload.nxchgrate)) * parseFloat(payload.nfbalance)).toFixed(2);

			payload.ccustno = invoice.customer.ccustno;
			payload.ccurrcode = invoice.customer.ccurrcode;
			payload.cresaleno = invoice.customer.cresaleno;

			payload.cbcompany = invoice.address1.ccompany;
			payload.cbaddr1 = invoice.address1.caddr1;
			payload.cbaddr2 = invoice.address1.caddr2;
			payload.cbcity = invoice.address1.ccity;
			payload.cbstate = invoice.address1.cstate;
			payload.cbzip = invoice.address1.czip;
			payload.cbcountry = invoice.address1.ccountry;
			payload.cbphone = invoice.address1.cphone;
			payload.cbcontact = invoice.address1.ccontact;

			payload.cscompany = invoice.address2.ccompany;
			payload.csaddr1 = invoice.address2.caddr1;
			payload.csaddr2 = invoice.address2.caddr2;
			payload.cscity = invoice.address2.ccity;
			payload.csstate = invoice.address2.cstate;
			payload.cszip = invoice.address2.czip;
			payload.cscountry = invoice.address2.ccountry;
			payload.csphone = invoice.address2.cphone;
			payload.cscontact = invoice.address2.ccontact;

			payload.notepad = invoice.notepad;

			var add_invoice_prom = GenericFactory.post("arinvoice", payload, custom_headers);

			add_invoice_prom.then(function (response) {
				if (response.status) {
					invoice.items.forEach(function (item) {
						var invoice_item_payload = {};
						invoice_item_payload.ccustno = payload.ccustno;
						invoice_item_payload.cwarehouse = payload.cwarehouse;
						invoice_item_payload.cinvno = payload.cinvno;
						invoice_item_payload.citemno = item.citemno;
						invoice_item_payload.cdescript = item.cdescript;
						invoice_item_payload.ndiscrate = parseFloat(item.discount);
						invoice_item_payload.nordqty = parseFloat(item.shipqty);
						invoice_item_payload.nshipqty = parseFloat(item.shipqty);
						invoice_item_payload.nfprice = parseFloat(item.nprice);
						invoice_item_payload.nfsalesamt = parseFloat(item.nprice) * parseFloat(item.shipqty);
						invoice_item_payload.nfdiscamt = (parseFloat(item.nprice) * parseFloat(item.shipqty) * parseFloat(item.discount) / 100);
						invoice_item_payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfsalesamt).toFixed(2);
						invoice_item_payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfdiscamt).toFixed(2);
						invoice_item_payload.nprice = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfprice).toFixed(2);

						GenericFactory.post("aritrs", invoice_item_payload, custom_headers).then(function (response) {
							if (response.status) {
								var message = "Invoice #{0} added successfully".format(payload.cinvno);
								alertify.success(message);
							}
						});
					});

					// $scope.valid_invoice_list = [];
					$state.go("ar_invoice_import_setup");
				} else {
					var message = "Error adding invoice #{0}. Maybe already added that invoice.".format(payload.cinvno);
					alertify.error(message);
				}
			});

		});
	};

}]);

app.controller('ImportValidInvoicesController', ["$scope", "$rootScope", "$state", "$timeout", function ($scope, $rootScope, $state, $timeout) {

	// $scope.selected_invoice_items = [];
	$scope.selectInvoice = function (invoice) {
		console.log(invoice);
		$scope.selected_invoice_items = invoice.items;
	};

}]);

app.controller('ImportInvalidInvoicesController', ["$scope", "$rootScope", "$state", "$timeout", function ($scope, $rootScope, $state, $timeout) {
}]);

app.directive("invoiceDate", ["$rootScope", function ($rootScope) {
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

app.controller('SalesReturnWithInvoiceSetupController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};
	// $rootScope.syst_selected_company = {"id":"6","cid":"inc","name":"Qualfin INC","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"inc_dbxyz","created":"2017-02-01 12:47:25","updated":null};

	// $scope.invoice_method_list = ["amend"];
	$scope.invoice_action = "amend";

	$rootScope.order_date_status = false;
	$rootScope.invoice_date_status = false;

	$scope.amend_invoice = {};
	// $scope.amend_invoice.invoice_to_search = 2853822;

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.$watch("invoice", function () {
		// console.log($scope.invoice);
	}, 1);

	$scope.$watch('invoice.items', function () {

		$scope.invoice.subtotal = 0;
		$scope.invoice.total_discount = 0;
		$scope.invoice.items.forEach(function (item, index) {
			if (!item.deleted) {
				$scope.invoice.subtotal += (item.shipqty * item.nprice);
				$scope.invoice.total_discount += (item.shipqty * item.nprice) * (item.discount / 100);
			}
		});

		$scope.invoice.subtotal = ($scope.invoice.subtotal * -1).toFixed(2);
		$scope.invoice.total_discount = ($scope.invoice.total_discount * -1).toFixed(2);

		$scope.calculateOverwriteSalesTax();
		$timeout(function () {
			$scope.calculateInvoiceTotal();
		});

	}, 1);

	$scope.invoice = {};
	$scope.invoice.items = [];
	$scope.invoice.corderby = $rootScope.logged_user.name;

	if (typeof ($scope.invoice.freight) == "undefined") {
		$scope.invoice.freight = 0;
	}
	if (typeof ($scope.invoice.adjustment) == "undefined") {
		$scope.invoice.adjustment = 0;
	}

	$scope.tax_rate2 = 0;
	$scope.tax_rate3 = 0;
	$scope.tax_amount2 = 0;
	$scope.tax_amount3 = 0;
	// $scope.tax_amount1 = 0;
	$scope.tax_rate_total = 0;
	$scope.tax_amount_total = 0;

	$scope.customer_list = [];
	$scope.fob_list = [];
	$scope.warehouse_list = [];
	$scope.shipvia_list = [];
	$scope.salesperson_list = [];
	$scope.remark_list = [];
	$scope.item_list = [];
	$scope.paycode_list = [];
	$scope.cusaddr_list = [];
	$scope.saletax_list = [];
	$scope.exchangerate_list = [];
	$scope.invoice_list = [];

	var customer_prom = GenericFactory.get("arcust", "", custom_headers);
	var fob_prom = GenericFactory.get("arfob", "", custom_headers);
	var warehouse_prom = GenericFactory.get("arwhse", "", custom_headers);
	var shipvia_prom = GenericFactory.get("arfrgt", "", custom_headers);
	var salesperson_prom = GenericFactory.get("arslpn", "", custom_headers);
	var remark_prom = GenericFactory.get("arirmk", "", custom_headers);
	var item_prom = GenericFactory.get("icitem", "limit/3", custom_headers);
	var item_prom = GenericFactory.get("ictype", "limit/3", custom_headers);
	var paycode_prom = GenericFactory.get("arpycd", "", custom_headers);
	var cusaddr_prom = GenericFactory.get("arcadr", "", custom_headers);
	var saletax_prom = GenericFactory.get("costax", "", custom_headers);
	var exchangerate_prom = GenericFactory.get("cocurr", "", custom_headers);
	var invoice_prom = GenericFactory.get("arinvoice", "limit/-1", custom_headers);


	customer_prom.then(function (response) {
		if (response.status) {
			$scope.customer_list = response.results;
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

		return salesperson_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.salesperson_list = response.results;
		}

		return remark_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.remark_list = response.results;
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

		return exchangerate_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.exchangerate_list = response.results;
		}

		// TEST
		$scope.updateCustomerData();

		return invoice_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.invoice_list = response.results;
			console.log($scope.invoice_list);
		}
	});

	$scope.openInvoiceModal = function () {
		$("#SelectInvoiceModal").modal("show");
	};

	$scope.selectInvoice = function (invoice) {
		$scope.amend_invoice.invoice_to_search = invoice.cinvno;
		$scope.searchInvoice();
		$("#SelectInvoiceModal").modal("hide");
	};

	$scope.changeInvoiceMode = function () {
		if ($scope.invoice_action == "amend") {
			$scope.invoice = {
				"items": []
			};
		}
	};

	$scope.updateCustomerData = function () {

		if (typeof ($scope.invoice.customer) != "undefined") {
			let customer = angular.copy($scope.invoice.customer);

			$scope.invoice.warehouse = {};
			$scope.invoice.address1 = {};
			$scope.invoice.address2 = {};
			$scope.invoice.sales_tax = {};
			$scope.invoice.cresaleno = "";
			$scope.invoice.cresaleno = $scope.invoice.customer.cresaleno;
			$scope.invoice.corderby = $scope.invoice.customer.corderby;

			// Load default warehouse
			$scope.warehouse_list.forEach(function (warehouse) {
				if (customer.cwarehouse == warehouse.cwarehouse) {
					$scope.invoice.warehouse = warehouse;
					return;
				}
			});

			// Load default address 1 & 2
			var selected_both_address = false;
			$scope.cusaddr_list.forEach(function (address) {
				selected_both_address = false;
				if (customer.cbilltono == address.caddrno && customer.ccustno == address.ccustno) {
					$scope.invoice.address1 = address;
				}

				if (customer.cshiptono == address.caddrno && customer.ccustno == address.ccustno) {
					$scope.invoice.address2 = address;
				}

				if (selected_both_address) {
					return;
				}
			});

			// Load default Sales Tax
			$scope.saletax_list.forEach(function (saletax) {
				if (customer.ctaxcode == saletax.centity1) {
					$scope.invoice.sales_tax = saletax;
					return;
				}
			});

			// Load default exchange rate
			$scope.exchangerate_list.forEach(function (exchange_rate) {
				if (customer.ccurrcode == exchange_rate.ccurrcode) {
					$scope.invoice.currency = exchange_rate.nxchgrate;
					return;
				}
			});
		}

	};

	$scope.calculateOverwriteSalesTax = function () {

		$timeout(function () {
			if (typeof ($scope.invoice.sales_tax) == "undefined") {
				$scope.invoice.sales_tax = {};
				$scope.invoice.sales_tax.ntaxrate1 = 0;
			}
			$scope.tax_rate1 = parseFloat($scope.invoice.sales_tax.ntaxrate1);
			$scope.tax_amount1 = ($scope.invoice.subtotal - $scope.invoice.total_discount) * (parseFloat($scope.invoice.sales_tax.ntaxrate1) / 100);

			$scope.tax_rate_total = $scope.tax_rate1 + $scope.tax_rate2 + $scope.tax_rate3;
			$scope.tax_amount_total = $scope.tax_amount1 + $scope.tax_amount2 + $scope.tax_amount3;

			$scope.invoice.overwrite_sales_tax = $scope.tax_amount_total;

			$scope.invoice.overwrite_sales_tax = $scope.invoice.overwrite_sales_tax.toFixed(2);
		});
	};

	$scope.calculateInvoiceTotal = function () {
		$scope.invoice.total = ($scope.invoice.subtotal - $scope.invoice.total_discount + parseFloat($scope.invoice.overwrite_sales_tax) + parseFloat($scope.invoice.freight) + parseFloat($scope.invoice.adjustment)).toFixed(2);
	};


	// Invoice manager toolbar [ Save ] [ Void ] [ Copy ] [ Clear ] [ Close ] [ Print ]

	$scope.saveInvoice = function () {

		if (!$rootScope.order_date_status || !$rootScope.invoice_date_status) {
			swal({
				title: "Invoice error!",
				text: "Please, check order date or invoice date.",
				type: "error"
			});
			return;
		}

		switch ($scope.invoice_action) {
			case "amend":

				var invoice = angular.copy($scope.invoice);
				var payload = {};

				var arsyst_prom = GenericFactory.get("arsyst", "", custom_headers);

				arsyst_prom.then(function (response) {
					if (response.status) {

						payload.ctype = "R";
						payload.coriginvno = invoice.cinvno;
						payload.active = true;
						payload.cinvno = parseInt(response.results[0].next_invoice);
						payload.cwarehouse = ((typeof (invoice.warehouse) != "undefined") ? invoice.warehouse.cwarehouse : null);
						payload.cpaycode = invoice.customer.cpaycode;
						payload.sidemarkno = invoice.sidemarkno;
						payload.sono = invoice.sono;
						payload.corderby = invoice.corderby;
						payload.cslpnno = ((typeof (invoice.salesperson) != "undefined") ? invoice.salesperson.cslpnno : null);
						payload.cshipvia = ((typeof (invoice.ship_via) != "undefined") ? invoice.ship_via.description : null);
						payload.cfob = ((typeof (invoice.fob) != "undefined") ? invoice.fob.code : null);
						payload.cpono = invoice.cpono;
						// payload.dorder = invoice.dorder;
						// payload.dinvoice = invoice.dinvoice;

						// MM/DD/YYYY
						var inv_order_date_obj = new Date(invoice.dorder);
						payload.dorder = "{0}/{1}/{2}".format(
							inv_order_date_obj.getMonth() + 1,
							inv_order_date_obj.getDate(),
							inv_order_date_obj.getFullYear()
						);
						var inv_date_obj = new Date(invoice.dinvoice);
						payload.dinvoice = "{0}/{1}/{2}".format(
							inv_date_obj.getMonth() + 1,
							inv_date_obj.getDate(),
							inv_date_obj.getFullYear()
						);

						payload.remark = ((typeof (invoice.remark) != "undefined") ? invoice.remark.code : null);

						var create_remark = true;
						$scope.remark_list.forEach(function (remark) {
							if (remark.code == payload.remark) {
								create_remark = false;
								return;
							}
						});

						if (create_remark) {
							GenericFactory.post("arirmk", invoice.remark, custom_headers);
						}

						payload.costax = ((typeof (invoice.sales_tax) != "undefined") ? invoice.sales_tax.id : null);
						payload.nxchgrate = invoice.currency;
						payload.nfsalesamt = invoice.subtotal;
						payload.nfdiscamt = invoice.total_discount;
						payload.nftaxamt1 = invoice.overwrite_sales_tax;
						payload.nfbalance = invoice.total;
						payload.nffrtamt = invoice.freight;

						payload.ntaxamt1 = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nftaxamt1)).toFixed(2);
						payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfdiscamt)).toFixed(2);
						payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfsalesamt)).toFixed(2);
						payload.nfrtamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nffrtamt)).toFixed(2);
						payload.nbalance = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfbalance)).toFixed(2);

						payload.ccustno = invoice.customer.ccustno;
						payload.ccurrcode = invoice.customer.ccurrcode;
						payload.cresaleno = invoice.cresaleno;
						payload.nadjamt = invoice.adjustment;

						payload.cbcompany = invoice.address1.ccompany;
						payload.cbaddr1 = invoice.address1.caddr1;
						payload.cbaddr2 = invoice.address1.caddr2;
						payload.cbcity = invoice.address1.ccity;
						payload.cbstate = invoice.address1.cstate;
						payload.cbzip = invoice.address1.czip;
						payload.cbcountry = invoice.address1.ccountry;
						payload.cbphone = invoice.address1.cphone;
						payload.cbcontact = invoice.address1.ccontact;

						payload.cscompany = invoice.address2.ccompany;
						payload.csaddr1 = invoice.address2.caddr1;
						payload.csaddr2 = invoice.address2.caddr2;
						payload.cscity = invoice.address2.ccity;
						payload.csstate = invoice.address2.cstate;
						payload.cszip = invoice.address2.czip;
						payload.cscountry = invoice.address2.ccountry;
						payload.csphone = invoice.address2.cphone;
						payload.cscontact = invoice.address2.ccontact;

						payload.notepad = invoice.notepad;

						// console.log(invoice.items);

						var new_invoice_prom = GenericFactory.post("arinvoice", payload, custom_headers);
						new_invoice_prom.then(function (response) {
							if (response.status) {

								invoice.items.forEach(function (item) {
									var invoice_item_payload = {};
									invoice_item_payload.ccustno = payload.ccustno;
									invoice_item_payload.cwarehouse = payload.cwarehouse;
									invoice_item_payload.cinvno = payload.cinvno;
									invoice_item_payload.citemno = item.citemno;
									invoice_item_payload.cdescript = item.cdescript;
									invoice_item_payload.ndiscrate = parseFloat(item.discount);
									invoice_item_payload.nordqty = parseFloat(item.shipqty) * -1;
									invoice_item_payload.nshipqty = parseFloat(item.shipqty) * -1;
									invoice_item_payload.nfprice = parseFloat(item.nprice);
									invoice_item_payload.nfsalesamt = (parseFloat(item.nprice) * parseFloat(item.shipqty)) * -1;
									invoice_item_payload.nfdiscamt = (parseFloat(item.nprice) * parseFloat(item.shipqty) * parseFloat(item.discount) / 100);
									invoice_item_payload.nsalesamt = (((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfsalesamt)).toFixed(2);
									invoice_item_payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfdiscamt).toFixed(2);
									invoice_item_payload.nprice = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfprice).toFixed(2);

									GenericFactory.post("aritrs", invoice_item_payload, custom_headers);
								});

								var arsyst_payload = {
									"id": 1,
									"next_invoice": payload.cinvno + 1
								};
								var arsyst_next_invoice_prom = GenericFactory.put("arsyst", arsyst_payload, custom_headers);
								arsyst_next_invoice_prom.then(function (response) {
									if (response.status) {
										let message = "You have added Sales Return Invoice #{0}".format(payload.cinvno);

										swal({
											title: "Success!",
											text: message,
											type: "success"
										});

										$scope.invoice = {
											"items": []
										};
										$state.go("ar_sales_return_with_invoice_setup");

										GenericFactory.get("arirmk", "", custom_headers).then(function (response) {
											if (response.status) {
												$scope.remark_list = response.results;
											}
										});
									} else {
										console.log(response);
										swal({
											title: "Error!",
											text: "Please, contact admin.",
											type: "error"
										});
									}
								});
							} else {
								swal({
									title: "Error!",
									text: "There is a problem adding the invoice, maybe the invoice # is already used in another invoice. Please, contact admin.",
									type: "error"
								});
							}
						});
					}
				});

				break;

			case "amend1":
			// var invoice = angular.copy($scope.invoice);
			// var payload = {};
			//
			// payload.id = invoice.id;
			// payload.cwarehouse = ((typeof(invoice.warehouse) != "undefined") ? invoice.warehouse.cwarehouse : null);
			// payload.cpaycode = invoice.customer.cpaycode;
			// payload.sidemarkno = invoice.sidemarkno;
			// payload.sono = invoice.sono;
			// payload.corderby = invoice.corderby;
			// payload.cslpnno = ((typeof(invoice.salesperson) != "undefined") ? invoice.salesperson.cslpnno : null);
			// payload.cshipvia = ((typeof(invoice.ship_via) != "undefined") ? invoice.ship_via.description : null);
			// payload.cfob = ((typeof(invoice.fob) != "undefined") ? invoice.fob.code : null);
			// payload.cpono = invoice.cpono;
			// payload.dorder = invoice.dorder;
			// payload.dinvoice = invoice.dinvoice;
			// payload.remark = ((typeof(invoice.remark) != "undefined") ? invoice.remark.code : null);
			//
			// var create_remark = true;
			// $scope.remark_list.forEach(function(remark) {
			//     if (remark.code == payload.remark) {
			//         create_remark = false;
			//         return;
			//     }
			// });
			//
			// if (create_remark) {
			//     GenericFactory.post("arirmk", invoice.remark, custom_headers);
			// }
			//
			// payload.costax = ((typeof(invoice.sales_tax) != "undefined") ? invoice.sales_tax.id : null);
			// payload.nxchgrate = invoice.currency;
			// payload.nfsalesamt = invoice.subtotal;
			// payload.nfdiscamt = invoice.total_discount;
			// payload.nftaxamt1 = invoice.overwrite_sales_tax;
			// // payload.nfbalance = invoice.total;
			// payload.nffrtamt = invoice.freight;
			//
			// payload.ntaxamt1 = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nftaxamt1)).toFixed(2);
			// payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfdiscamt)).toFixed(2);
			// payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfsalesamt)).toFixed(2);
			// payload.nfrtamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nffrtamt)).toFixed(2);
			// // payload.nbalance = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfbalance)).toFixed(2);
			//
			// payload.ccustno = invoice.customer.ccustno;
			// payload.ccurrcode = invoice.customer.ccurrcode;
			// payload.nadjamt = invoice.adjustment;
			//
			// payload.cbcompany = invoice.address1.ccompany;
			// payload.cbaddr1 = invoice.address1.caddr1;
			// payload.cbaddr2 = invoice.address1.caddr2;
			// payload.cbcity = invoice.address1.ccity;
			// payload.cbstate = invoice.address1.cstate;
			// payload.cbzip = invoice.address1.czip;
			// payload.cbcountry = invoice.address1.ccountry;
			// payload.cbphone = invoice.address1.cphone;
			// payload.cbcontact = invoice.address1.ccontact;
			//
			// payload.cscompany = invoice.address2.ccompany;
			// payload.csaddr1 = invoice.address2.caddr1;
			// payload.csaddr2 = invoice.address2.caddr2;
			// payload.cscity = invoice.address2.ccity;
			// payload.csstate = invoice.address2.cstate;
			// payload.cszip = invoice.address2.czip;
			// payload.cscountry = invoice.address2.ccountry;
			// payload.csphone = invoice.address2.cphone;
			// payload.cscontact = invoice.address2.ccontact;
			//
			// payload.notepad = invoice.notepad;
			//
			// var new_invoice_prom = GenericFactory.put("arinvoice", payload, custom_headers);
			// new_invoice_prom.then(function(response) {
			//     if (response.status) {
			//
			//         var update_item_prom_list = [];
			//         invoice.items.forEach(function(item) {
			//             var invoice_item_payload = {};
			//             invoice_item_payload.id = item.id;
			//             invoice_item_payload.ccustno = payload.ccustno;
			//             invoice_item_payload.cwarehouse = payload.cwarehouse;
			//             invoice_item_payload.cinvno = invoice.cinvno;
			//             invoice_item_payload.citemno = item.citemno;
			//             invoice_item_payload.cdescript = item.cdescript;
			//             invoice_item_payload.ndiscrate = parseFloat(item.discount);
			//             invoice_item_payload.nordqty = parseFloat(item.shipqty);
			//             invoice_item_payload.nshipqty = parseFloat(item.shipqty);
			//             invoice_item_payload.nfprice = parseFloat(item.nprice);
			//             invoice_item_payload.nfsalesamt = parseFloat(item.nprice) * parseFloat(item.shipqty);
			//             invoice_item_payload.nfdiscamt = (parseFloat(item.nprice) * parseFloat(item.shipqty) * parseFloat(item.discount) / 100);
			//             invoice_item_payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfsalesamt).toFixed(2);
			//             invoice_item_payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfdiscamt).toFixed(2);
			//             invoice_item_payload.nprice = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfprice).toFixed(2);
			//
			//             if (item.to_update) {
			//                 if (item.deleted) {
			//                     GenericFactory.delete("aritrs", invoice_item_payload.id, custom_headers);
			//                 } else {
			//                     GenericFactory.put("aritrs", invoice_item_payload, custom_headers);
			//                 }
			//             } else {
			//                 GenericFactory.post("aritrs", invoice_item_payload, custom_headers);
			//             }
			//         });
			//
			//         $scope.invoice = {
			//             "items": []
			//         };
			//         $state.go("ar_invoice_setup");
			//         swal({
			//             title: "Success!",
			//             text: "Invoice successfully updated",
			//             type: "success"
			//         });
			//     }
			// });



			default:

		}

	};

	$scope.searchInvoice = function () {
		var invoice_no = $scope.amend_invoice.invoice_to_search;

		var original_invoice = {};
		original_invoice.items = [];

		var search_query = "cinvno/{0}".format(invoice_no);
		var search_invoice_prom = GenericFactory.get("arinvoice", search_query, custom_headers);
		var invoice_items_prom = GenericFactory.get("aritrs", "limit/-1", custom_headers);

		search_invoice_prom.then(function (response) {
			if (response.status) {
				original_invoice = angular.extend(original_invoice, response.results[0]);
			}

			return invoice_items_prom;
		}).then(function (response) {
			if (response.status) {
				response.results.forEach(function (item) {
					if (item.cinvno == original_invoice.cinvno) {
						original_invoice.items.push(item);
					}
				});
			}

			var invoice = {};
			invoice.items = [];
			$scope.warehouse_list.forEach(function (warehouse) {
				if (original_invoice.cwarehouse == warehouse.cwarehouse) {
					invoice.warehouse = warehouse;
					return;
				}
			});
			$scope.salesperson_list.forEach(function (salesperson) {
				if (original_invoice.cslpnno == salesperson.cslpnno) {
					invoice.salesperson = salesperson;
					return;
				}
			});
			$scope.shipvia_list.forEach(function (ship_via) {
				if (original_invoice.cshipvia == ship_via.description) {
					invoice.ship_via = ship_via;
					return;
				}
			});
			$scope.fob_list.forEach(function (fob) {
				if (original_invoice.cfob == fob.code) {
					invoice.fob = fob;
					return;
				}
			});
			$scope.remark_list.forEach(function (remark) {
				if (original_invoice.remark == remark.code) {
					invoice.remark = remark;
					return;
				}
			});
			$scope.saletax_list.forEach(function (sales_tax) {
				if (original_invoice.costax == sales_tax.id) {
					invoice.sales_tax = sales_tax;
					return;
				}
			});
			$scope.customer_list.forEach(function (customer) {
				if (original_invoice.ccustno == customer.ccustno) {
					invoice.customer = customer;
					return;
				}
			});

			invoice.id = original_invoice.id;
			invoice.active = original_invoice.active;
			invoice.cinvno = original_invoice.cinvno;
			invoice.sono = original_invoice.sono;
			invoice.sidemarkno = original_invoice.sidemarkno;
			invoice.corderby = original_invoice.corderby;
			invoice.cpono = original_invoice.cpono;
			invoice.cresaleno = invoice.customer.cresaleno;

			invoice.dorder = new Date(original_invoice.dorder);
			invoice.dinvoice = new Date(original_invoice.dinvoice);
			// invoice.dorder = original_invoice.dorder;
			// $("#invoice_order_date").val(original_invoice.dorder);
			// invoice.dinvoice = original_invoice.dinvoice;
			// $("#invoice_invoice_date").val(original_invoice.dinvoice);
			$rootScope.order_date_status = true;
			$rootScope.invoice_date_status = true;

			invoice.currency = original_invoice.nxchgrate;
			invoice.subtotal = parseFloat(original_invoice.nfsalesamt).toFixed(2);
			invoice.total_discount = original_invoice.nfdiscamt;
			invoice.overwrite_sales_tax = original_invoice.nftaxamt1;
			invoice.total = original_invoice.nfbalance;
			invoice.freight = original_invoice.nffrtamt;

			invoice.adjustment = original_invoice.nadjamt;

			invoice.address1 = {};
			invoice.address1.ccompany = original_invoice.cbcompany;
			invoice.address1.caddr1 = original_invoice.cbaddr1;
			invoice.address1.caddr2 = original_invoice.cbaddr2;
			invoice.address1.ccity = original_invoice.cbcity;
			invoice.address1.cstate = original_invoice.cbstate;
			invoice.address1.czip = original_invoice.cbzip;
			invoice.address1.ccountry = original_invoice.cbcountry;
			invoice.address1.cphone = original_invoice.cbphone;
			invoice.address1.ccontact = original_invoice.cbcontact;

			invoice.address2 = {};
			invoice.address2.ccompany = original_invoice.cscompany;
			invoice.address2.caddr1 = original_invoice.csaddr1;
			invoice.address2.caddr2 = original_invoice.csaddr2;
			invoice.address2.ccity = original_invoice.cscity;
			invoice.address2.cstate = original_invoice.csstate;
			invoice.address2.czip = original_invoice.cszip;
			invoice.address2.ccountry = original_invoice.cscountry;
			invoice.address2.cphone = original_invoice.csphone;
			invoice.address2.ccontact = original_invoice.cscontact;

			invoice.notepad = original_invoice.notepad;

			original_invoice.items.forEach(function (original_item) {
				var item = {};
				item.id = original_item.id;
				item.to_update = true; // flag to indicate that this item its already created in DB (aritrs)
				item.deleted = false; // flag to indicate that if in save we will delete this item
				item.citemno = original_item.citemno;
				item.cdescript = original_item.cdescript;
				item.shipqty = original_item.nshipqty;
				item.nprice = original_item.nfprice;
				item.discount = original_item.ndiscrate;
				// item.extended = ((item.shipqty * item.nprice) - ((item.shipqty * item.nprice) * (item.discount / 100))).toFixed(2);

				invoice.items.push(item);
			});

			$scope.invoice = invoice;

		});
	};

	$scope.deleteInvoice = function () {
		var payload = {
			"id": $scope.invoice.id,
			"active": 0
		};
		GenericFactory.put("arinvoice", payload, custom_headers).then(function (response) {
			if (response.status) {
				swal({
					title: "Success!",
					text: "Invoice deleted successfully",
					type: "success"
				});
			}
		});
	};

	$scope.clearInvoice = function () {
		$scope.invoice = {
			"items": []
		};
		$state.go("ar_invoice_setup");
	};

}]);

app.controller('SalesReturnWithInvoiceNotepadController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = true;
}]);

app.controller('SalesReturnWithInvoicePaymentController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = true;


	$scope.openPayCodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (paycode) {
		$scope.invoice.customer.cpaycode = paycode.cpaycode;
		$scope.invoice.cbankno = paycode.cbankno;
		$("#SelectPaycodeModal").modal("hide");
	};

	$scope.openAddressModal = function (n_address) {
		$scope.selecting_address_n = n_address;
		$("#SelectAddressModal").modal("show");
	};

	$scope.selectAddress = function (address) {
		if ($scope.selecting_address_n == 1) {
			$scope.invoice.address1 = address;
		} else {
			$scope.invoice.address2 = address;
		}
		$("#SelectAddressModal").modal("hide");
	};

	$scope.openTaxModal = function () {
		$("#SelectSaleTaxModal").modal("show");
	};

	$scope.selectTax = function (tax) {
		$scope.invoice.sales_tax = tax;
		$("#SelectSaleTaxModal").modal("hide");
	};

	
}]);

app.controller('SalesReturnWithInvoiceInformationController', ["$scope", "$rootScope", function ($scope, $rootScope) {
	$rootScope.enable_print_invoice_preview = true;


	$scope.openSalesPersonModal = function () {
		$("#SelectSalesPersonModal").modal("show");
	};

	$scope.selectSalesPerson = function (salesperson) {
		$scope.invoice.salesperson = salesperson;
		$("#SelectSalesPersonModal").modal("hide");
	};

	$scope.openRemarkModal = function () {
		$("#SelectRemarkModal").modal("show");
	};

	$scope.selectRemark = function (remark) {
		$scope.invoice.remark = remark;
		$("#SelectRemarkModal").modal("hide");
	};

	// Plugins
	$("#ship_via_select").select2();
	$("#fob_select").select2();
	$("#warehouse_select").select2();
	$("#remark_select").select2();


	// $('#invoice_order_date').formatter({
	//     'pattern': '{{99}}/{{99}}/{{9999}}',
	//     'persistent': true
	// });
	// $('#invoice_invoice_date').formatter({
	//     'pattern': '{{99}}/{{99}}/{{9999}}',
	//     'persistent': true
	// });

}]);

app.controller('SalesReturnWithInvoiceLineItemsController', ["$scope", "$rootScope", "$state", "$timeout", "GenericFactory", function ($scope, $rootScope, $state, $timeout, GenericFactory) {

	$rootScope.enable_print_invoice_preview = true;

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.current_item_to_search = {};

	// Object to show extra info
	$scope.selected_item = {};

	$scope.addEmptyItem = function () {
		$scope.invoice.items.push({
			"discount": 0,
			"shipqty": 1
		});
	};

	$scope.searchStockItem = function (table_row_item) {

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

		$scope.invoice.items[$index].deleted = true;
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

app.controller('SalesReturnWithoutInvoiceSetupController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function ($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};
	$rootScope.syst_selected_company = {
		"id": "6",
		"cid": "inc",
		"name": "Qualfin INC",
		"address": "address1",
		"city": "city1",
		"state": "state1",
		"zip": "42315",
		"phone": "1234567890",
		"subdirectory": "subdirectory1",
		"nofp": "2",
		"df": "American",
		"hcurrency": "USD",
		"fdofd": "05/20/1994",
		"cfy": "2007",
		"sta": "USA",
		"db_hostname": "11.11.11.11",
		"db_port": "3306",
		"db_username": "erick",
		"db_password": "password",
		"db_schema": "inc_dbxyz",
		"created": "2017-02-01 12:47:25",
		"updated": null
	};

	$scope.invoice_method_list = ["amend", "add"];


	$rootScope.order_date_status = false;
	$rootScope.invoice_date_status = false;

	$scope.amend_invoice = {};
	// $scope.amend_invoice.invoice_to_search = 123456803;

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.$watch("invoice", function () {
		// console.log($scope.invoice);
	}, 1);

	$scope.$watch('invoice.items', function () {

		$scope.invoice.subtotal = 0;
		$scope.invoice.total_discount = 0;
		$scope.invoice.items.forEach(function (item, index) {
			if (!item.deleted) {
				$scope.invoice.subtotal += (item.shipqty * item.nprice);
				$scope.invoice.total_discount += (item.shipqty * item.nprice) * (item.discount / 100);
			}
		});

		$scope.invoice.subtotal = ($scope.invoice.subtotal * -1).toFixed(2);
		$scope.invoice.total_discount = ($scope.invoice.total_discount * -1).toFixed(2);

		$scope.calculateOverwriteSalesTax();
		$timeout(function () {
			$scope.calculateInvoiceTotal();
		});

	}, 1);

	$scope.invoice = {};
	$scope.invoice.items = [];
	$scope.invoice.corderby = $rootScope.logged_user.name;

	if (typeof ($scope.invoice.freight) == "undefined") {
		$scope.invoice.freight = 0;
	}
	if (typeof ($scope.invoice.adjustment) == "undefined") {
		$scope.invoice.adjustment = 0;
	}

	$scope.tax_rate2 = 0;
	$scope.tax_rate3 = 0;
	$scope.tax_amount2 = 0;
	$scope.tax_amount3 = 0;
	// $scope.tax_amount1 = 0;
	$scope.tax_rate_total = 0;
	$scope.tax_amount_total = 0;

	$scope.customer_list = [];
	$scope.fob_list = [];
	$scope.warehouse_list = [];
	$scope.shipvia_list = [];
	$scope.salesperson_list = [];
	$scope.remark_list = [];
	$scope.item_list = [];
	$scope.paycode_list = [];
	$scope.cusaddr_list = [];
	$scope.saletax_list = [];
	$scope.exchangerate_list = [];
	$scope.invoice_list = [];

	var customer_prom = GenericFactory.get("arcust", "", custom_headers);
	var fob_prom = GenericFactory.get("arfob", "", custom_headers);
	var warehouse_prom = GenericFactory.get("arwhse", "", custom_headers);
	var shipvia_prom = GenericFactory.get("arfrgt", "", custom_headers);
	var salesperson_prom = GenericFactory.get("arslpn", "", custom_headers);
	var remark_prom = GenericFactory.get("arirmk", "", custom_headers);
	var item_prom = GenericFactory.get("icitem", "limit/3", custom_headers);
	var item_prom = GenericFactory.get("ictype", "limit/3", custom_headers);
	var paycode_prom = GenericFactory.get("arpycd", "", custom_headers);
	var cusaddr_prom = GenericFactory.get("arcadr", "", custom_headers);
	var saletax_prom = GenericFactory.get("costax", "", custom_headers);
	var exchangerate_prom = GenericFactory.get("cocurr", "", custom_headers);
	var invoice_prom = GenericFactory.get("arinvoice", "limit/-1", custom_headers);


	customer_prom.then(function (response) {
		if (response.status) {
			$scope.customer_list = response.results;
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

		return salesperson_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.salesperson_list = response.results;
		}

		return remark_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.remark_list = response.results;
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

		return exchangerate_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.exchangerate_list = response.results;
		}

		// TEST
		$scope.updateCustomerData();

		return invoice_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.invoice_list = response.results;
			// console.log($scope.invoice_list);
		}
	});

	$scope.openInvoiceModal = function () {
		$("#SelectInvoiceModal").modal("show");
	};

	$scope.selectInvoice = function (invoice) {
		$scope.amend_invoice.invoice_to_search = invoice.cinvno;
		$scope.searchInvoice();
		$("#SelectInvoiceModal").modal("hide");
	};

	$scope.changeInvoiceMode = function () {
		if ($scope.invoice_action == "amend") {
			$scope.invoice = {
				"items": []
			};
		}
	};

	$scope.updateCustomerData = function () {

		if (typeof ($scope.invoice.customer) != "undefined") {
			let customer = angular.copy($scope.invoice.customer);

			$scope.invoice.warehouse = {};
			$scope.invoice.address1 = {};
			$scope.invoice.address2 = {};
			$scope.invoice.sales_tax = {};
			$scope.invoice.cresaleno = "";
			$scope.invoice.cresaleno = $scope.invoice.customer.cresaleno;
			$scope.invoice.corderby = $scope.invoice.customer.corderby;

			// Load default warehouse
			$scope.warehouse_list.forEach(function (warehouse) {
				if (customer.cwarehouse == warehouse.cwarehouse) {
					$scope.invoice.warehouse = warehouse;
					return;
				}
			});

			// Load default address 1 & 2
			var selected_both_address = false;
			$scope.cusaddr_list.forEach(function (address) {
				selected_both_address = false;
				if (customer.cbilltono == address.caddrno && customer.ccustno == address.ccustno) {
					$scope.invoice.address1 = address;
				}

				if (customer.cshiptono == address.caddrno && customer.ccustno == address.ccustno) {
					$scope.invoice.address2 = address;
				}

				if (selected_both_address) {
					return;
				}
			});

			// Load default Sales Tax
			$scope.saletax_list.forEach(function (saletax) {
				if (customer.ctaxcode == saletax.centity1) {
					$scope.invoice.sales_tax = saletax;
					return;
				}
			});

			// Load default exchange rate
			$scope.exchangerate_list.forEach(function (exchange_rate) {
				if (customer.ccurrcode == exchange_rate.ccurrcode) {
					$scope.invoice.currency = exchange_rate.nxchgrate;
					return;
				}
			});
		}

	};

	$scope.calculateOverwriteSalesTax = function () {

		$timeout(function () {
			if (typeof ($scope.invoice.sales_tax) == "undefined") {
				$scope.invoice.sales_tax = {};
				$scope.invoice.sales_tax.ntaxrate1 = 0;
			}
			$scope.tax_rate1 = parseFloat($scope.invoice.sales_tax.ntaxrate1);
			$scope.tax_amount1 = ($scope.invoice.subtotal - $scope.invoice.total_discount) * (parseFloat($scope.invoice.sales_tax.ntaxrate1) / 100);

			$scope.tax_rate_total = $scope.tax_rate1 + $scope.tax_rate2 + $scope.tax_rate3;
			$scope.tax_amount_total = $scope.tax_amount1 + $scope.tax_amount2 + $scope.tax_amount3;

			$scope.invoice.overwrite_sales_tax = $scope.tax_amount_total;

			$scope.invoice.overwrite_sales_tax = $scope.invoice.overwrite_sales_tax.toFixed(2);
		});
	};

	$scope.calculateInvoiceTotal = function () {
		$scope.invoice.total = ($scope.invoice.subtotal - $scope.invoice.total_discount + parseFloat($scope.invoice.overwrite_sales_tax) + parseFloat($scope.invoice.freight) + parseFloat($scope.invoice.adjustment)).toFixed(2);
	};


	// Invoice manager toolbar [ Save ] [ Void ] [ Copy ] [ Clear ] [ Close ] [ Print ]

	$scope.saveInvoice = function () {

		// if (!$rootScope.order_date_status || !$rootScope.invoice_date_status) {
		//     swal({
		//         title: "Invoice error!",
		//         text: "Please, check order date or invoice date.",
		//         type: "error"
		//     });
		//     return;
		// }

		switch ($scope.invoice_action) {
			case "add":

				var invoice = angular.copy($scope.invoice);
				var payload = {};

				var arsyst_prom = GenericFactory.get("arsyst", "", custom_headers);

				arsyst_prom.then(function (response) {
					if (response.status) {

						payload.ctype = "R";

						payload.active = true;
						payload.cinvno = parseInt(response.results[0].next_invoice);
						payload.cwarehouse = ((typeof (invoice.warehouse) != "undefined") ? invoice.warehouse.cwarehouse : null);
						payload.cpaycode = invoice.customer.cpaycode;
						payload.sidemarkno = invoice.sidemarkno;
						payload.sono = invoice.sono;
						payload.corderby = invoice.corderby;
						payload.cslpnno = ((typeof (invoice.salesperson) != "undefined") ? invoice.salesperson.cslpnno : null);
						payload.cshipvia = ((typeof (invoice.ship_via) != "undefined") ? invoice.ship_via.description : null);
						payload.cfob = ((typeof (invoice.fob) != "undefined") ? invoice.fob.code : null);
						payload.cpono = invoice.cpono;

						// MM/DD/YYYY
						var inv_order_date_obj = new Date(invoice.dorder);
						payload.dorder = "{0}/{1}/{2}".format(
							inv_order_date_obj.getMonth() + 1,
							inv_order_date_obj.getDate(),
							inv_order_date_obj.getFullYear()
						);
						var inv_date_obj = new Date(invoice.dinvoice);
						payload.dinvoice = "{0}/{1}/{2}".format(
							inv_date_obj.getMonth() + 1,
							inv_date_obj.getDate(),
							inv_date_obj.getFullYear()
						);
						// payload.dinvoice = invoice.dinvoice;

						payload.remark = ((typeof (invoice.remark) != "undefined") ? invoice.remark.code : null);

						var create_remark = true;
						$scope.remark_list.forEach(function (remark) {
							if (remark.code == payload.remark) {
								create_remark = false;
								return;
							}
						});

						if (create_remark) {
							GenericFactory.post("arirmk", invoice.remark, custom_headers);
						}

						payload.costax = ((typeof (invoice.sales_tax) != "undefined") ? invoice.sales_tax.id : null);
						payload.nxchgrate = invoice.currency;
						payload.nfsalesamt = invoice.subtotal;
						payload.nfdiscamt = invoice.total_discount;
						payload.nftaxamt1 = invoice.overwrite_sales_tax;
						payload.nfbalance = invoice.total;
						payload.nffrtamt = invoice.freight;

						payload.ntaxamt1 = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nftaxamt1)).toFixed(2);
						payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfdiscamt)).toFixed(2);
						payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfsalesamt)).toFixed(2);
						payload.nfrtamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nffrtamt)).toFixed(2);
						payload.nbalance = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfbalance)).toFixed(2);

						payload.ccustno = invoice.customer.ccustno;
						payload.ccurrcode = invoice.customer.ccurrcode;
						payload.cresaleno = invoice.cresaleno;
						payload.nadjamt = invoice.adjustment;

						payload.cbcompany = invoice.address1.ccompany;
						payload.cbaddr1 = invoice.address1.caddr1;
						payload.cbaddr2 = invoice.address1.caddr2;
						payload.cbcity = invoice.address1.ccity;
						payload.cbstate = invoice.address1.cstate;
						payload.cbzip = invoice.address1.czip;
						payload.cbcountry = invoice.address1.ccountry;
						payload.cbphone = invoice.address1.cphone;
						payload.cbcontact = invoice.address1.ccontact;

						payload.cscompany = invoice.address2.ccompany;
						payload.csaddr1 = invoice.address2.caddr1;
						payload.csaddr2 = invoice.address2.caddr2;
						payload.cscity = invoice.address2.ccity;
						payload.csstate = invoice.address2.cstate;
						payload.cszip = invoice.address2.czip;
						payload.cscountry = invoice.address2.ccountry;
						payload.csphone = invoice.address2.cphone;
						payload.cscontact = invoice.address2.ccontact;

						payload.notepad = invoice.notepad;

						// console.log(invoice.items);

						var new_invoice_prom = GenericFactory.post("arinvoice", payload, custom_headers);
						new_invoice_prom.then(function (response) {
							if (response.status) {

								invoice.items.forEach(function (item) {
									var invoice_item_payload = {};
									invoice_item_payload.ccustno = payload.ccustno;
									invoice_item_payload.cwarehouse = payload.cwarehouse;
									invoice_item_payload.cinvno = payload.cinvno;
									invoice_item_payload.citemno = item.citemno;
									invoice_item_payload.cdescript = item.cdescript;
									invoice_item_payload.ndiscrate = parseFloat(item.discount);
									invoice_item_payload.nordqty = parseFloat(item.shipqty) * -1;
									invoice_item_payload.nshipqty = parseFloat(item.shipqty) * -1;
									invoice_item_payload.nfprice = parseFloat(item.nprice);
									invoice_item_payload.nfsalesamt = (parseFloat(item.nprice) * parseFloat(item.shipqty)) * -1;
									invoice_item_payload.nfdiscamt = (parseFloat(item.nprice) * parseFloat(item.shipqty) * parseFloat(item.discount) / 100);
									invoice_item_payload.nsalesamt = (((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfsalesamt)).toFixed(2);
									invoice_item_payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfdiscamt).toFixed(2);
									invoice_item_payload.nprice = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfprice).toFixed(2);

									GenericFactory.post("aritrs", invoice_item_payload, custom_headers);
								});

								var arsyst_payload = {
									"id": 1,
									"next_invoice": payload.cinvno + 1
								};
								var arsyst_next_invoice_prom = GenericFactory.put("arsyst", arsyst_payload, custom_headers);
								arsyst_next_invoice_prom.then(function (response) {
									if (response.status) {
										let message = "You have added Sales Return Invoice #{0}".format(payload.cinvno);

										swal({
											title: "Success!",
											text: message,
											type: "success"
										});

										$scope.invoice = {
											"items": []
										};
										$state.go("ar_sales_return_without_invoice_setup");

										GenericFactory.get("arirmk", "", custom_headers).then(function (response) {
											if (response.status) {
												$scope.remark_list = response.results;
											}
										});
									} else {
										console.log(response);
										swal({
											title: "Error!",
											text: "Please, contact admin.",
											type: "error"
										});
									}
								});
							} else {
								swal({
									title: "Error!",
									text: "There is a problem adding the invoice, maybe the invoice # is already used in another invoice. Please, contact admin.",
									type: "error"
								});
							}
						});
					}
				});

				break;

			case "amend":
				var invoice = angular.copy($scope.invoice);
				var payload = {};

				payload.id = invoice.id;
				payload.cwarehouse = ((typeof (invoice.warehouse) != "undefined") ? invoice.warehouse.cwarehouse : null);
				payload.cpaycode = invoice.customer.cpaycode;
				payload.sidemarkno = invoice.sidemarkno;
				payload.sono = invoice.sono;
				payload.corderby = invoice.corderby;
				payload.cslpnno = ((typeof (invoice.salesperson) != "undefined") ? invoice.salesperson.cslpnno : null);
				payload.cshipvia = ((typeof (invoice.ship_via) != "undefined") ? invoice.ship_via.description : null);
				payload.cfob = ((typeof (invoice.fob) != "undefined") ? invoice.fob.code : null);
				payload.cpono = invoice.cpono;
				// payload.dorder = invoice.dorder;
				// payload.dinvoice = invoice.dinvoice;

				// MM/DD/YYYY
				var inv_order_date_obj = new Date(invoice.dorder);
				payload.dorder = "{0}/{1}/{2}".format(
					inv_order_date_obj.getMonth() + 1,
					inv_order_date_obj.getDate(),
					inv_order_date_obj.getFullYear()
				);
				var inv_date_obj = new Date(invoice.dinvoice);
				payload.dinvoice = "{0}/{1}/{2}".format(
					inv_date_obj.getMonth() + 1,
					inv_date_obj.getDate(),
					inv_date_obj.getFullYear()
				);

				payload.remark = ((typeof (invoice.remark) != "undefined") ? invoice.remark.code : null);

				var create_remark = true;
				$scope.remark_list.forEach(function (remark) {
					if (remark.code == payload.remark) {
						create_remark = false;
						return;
					}
				});

				if (create_remark) {
					GenericFactory.post("arirmk", invoice.remark, custom_headers);
				}

				payload.costax = ((typeof (invoice.sales_tax) != "undefined") ? invoice.sales_tax.id : null);
				payload.nxchgrate = invoice.currency;
				payload.nfsalesamt = invoice.subtotal;
				payload.nfdiscamt = invoice.total_discount;
				payload.nftaxamt1 = invoice.overwrite_sales_tax;
				// payload.nfbalance = invoice.total;
				payload.nffrtamt = invoice.freight;

				payload.ntaxamt1 = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nftaxamt1)).toFixed(2);
				payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfdiscamt)).toFixed(2);
				payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfsalesamt)).toFixed(2);
				payload.nfrtamt = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nffrtamt)).toFixed(2);
				// payload.nbalance = ((1 / parseFloat(invoice.currency)) * parseFloat(payload.nfbalance)).toFixed(2);

				payload.ccustno = invoice.customer.ccustno;
				payload.ccurrcode = invoice.customer.ccurrcode;
				payload.nadjamt = invoice.adjustment;

				payload.cbcompany = invoice.address1.ccompany;
				payload.cbaddr1 = invoice.address1.caddr1;
				payload.cbaddr2 = invoice.address1.caddr2;
				payload.cbcity = invoice.address1.ccity;
				payload.cbstate = invoice.address1.cstate;
				payload.cbzip = invoice.address1.czip;
				payload.cbcountry = invoice.address1.ccountry;
				payload.cbphone = invoice.address1.cphone;
				payload.cbcontact = invoice.address1.ccontact;

				payload.cscompany = invoice.address2.ccompany;
				payload.csaddr1 = invoice.address2.caddr1;
				payload.csaddr2 = invoice.address2.caddr2;
				payload.cscity = invoice.address2.ccity;
				payload.csstate = invoice.address2.cstate;
				payload.cszip = invoice.address2.czip;
				payload.cscountry = invoice.address2.ccountry;
				payload.csphone = invoice.address2.cphone;
				payload.cscontact = invoice.address2.ccontact;

				payload.notepad = invoice.notepad;

				var new_invoice_prom = GenericFactory.put("arinvoice", payload, custom_headers);
				new_invoice_prom.then(function (response) {
					if (response.status) {

						var update_item_prom_list = [];
						invoice.items.forEach(function (item) {
							var invoice_item_payload = {};
							invoice_item_payload.id = item.id;
							invoice_item_payload.ccustno = payload.ccustno;
							invoice_item_payload.cwarehouse = payload.cwarehouse;
							invoice_item_payload.cinvno = invoice.cinvno;
							invoice_item_payload.citemno = item.citemno;
							invoice_item_payload.cdescript = item.cdescript;
							invoice_item_payload.ndiscrate = parseFloat(item.discount);
							invoice_item_payload.nordqty = parseFloat(item.shipqty) * -1;
							invoice_item_payload.nshipqty = parseFloat(item.shipqty) * -1;
							invoice_item_payload.nfprice = parseFloat(item.nprice);
							invoice_item_payload.nfsalesamt = (parseFloat(item.nprice) * parseFloat(item.shipqty)) * -1;
							invoice_item_payload.nfdiscamt = (parseFloat(item.nprice) * parseFloat(item.shipqty) * parseFloat(item.discount) / 100);
							invoice_item_payload.nsalesamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfsalesamt).toFixed(2);
							invoice_item_payload.ndiscamt = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfdiscamt).toFixed(2);
							invoice_item_payload.nprice = ((1 / parseFloat(invoice.currency)) * invoice_item_payload.nfprice).toFixed(2);

							if (item.to_update) {
								if (item.deleted) {
									GenericFactory.delete("aritrs", invoice_item_payload.id, custom_headers);
								} else {
									GenericFactory.put("aritrs", invoice_item_payload, custom_headers);
								}
							} else {
								GenericFactory.post("aritrs", invoice_item_payload, custom_headers);
							}
						});

						$scope.invoice = {
							"items": []
						};
						$state.go("ar_sales_return_without_invoice_setup");
						swal({
							title: "Success!",
							text: "Invoice successfully updated",
							type: "success"
						});
					}
				});



			default:

		}

	};

	$scope.searchInvoice = function () {
		var invoice_no = $scope.amend_invoice.invoice_to_search;

		var original_invoice = {};
		original_invoice.items = [];

		var search_query = "cinvno/{0}".format(invoice_no);
		var search_invoice_prom = GenericFactory.get("arinvoice", search_query, custom_headers);
		var invoice_items_prom = GenericFactory.get("aritrs", "limit/-1", custom_headers);

		search_invoice_prom.then(function (response) {
			if (response.status) {
				original_invoice = angular.extend(original_invoice, response.results[0]);
			}

			return invoice_items_prom;
		}).then(function (response) {
			if (response.status) {
				response.results.forEach(function (item) {
					if (item.cinvno == original_invoice.cinvno) {
						original_invoice.items.push(item);
					}
				});
			}

			var invoice = {};
			invoice.items = [];
			$scope.warehouse_list.forEach(function (warehouse) {
				if (original_invoice.cwarehouse == warehouse.cwarehouse) {
					invoice.warehouse = warehouse;
					return;
				}
			});
			$scope.salesperson_list.forEach(function (salesperson) {
				if (original_invoice.cslpnno == salesperson.cslpnno) {
					invoice.salesperson = salesperson;
					return;
				}
			});
			$scope.shipvia_list.forEach(function (ship_via) {
				if (original_invoice.cshipvia == ship_via.description) {
					invoice.ship_via = ship_via;
					return;
				}
			});
			$scope.fob_list.forEach(function (fob) {
				if (original_invoice.cfob == fob.code) {
					invoice.fob = fob;
					return;
				}
			});
			$scope.remark_list.forEach(function (remark) {
				if (original_invoice.remark == remark.code) {
					invoice.remark = remark;
					return;
				}
			});
			$scope.saletax_list.forEach(function (sales_tax) {
				if (original_invoice.costax == sales_tax.id) {
					invoice.sales_tax = sales_tax;
					return;
				}
			});
			$scope.customer_list.forEach(function (customer) {
				if (original_invoice.ccustno == customer.ccustno) {
					invoice.customer = customer;
					return;
				}
			});

			invoice.id = original_invoice.id;
			invoice.active = original_invoice.active;
			invoice.cinvno = original_invoice.cinvno;
			invoice.sono = original_invoice.sono;
			invoice.sidemarkno = original_invoice.sidemarkno;
			invoice.corderby = original_invoice.corderby;
			invoice.cpono = original_invoice.cpono;
			invoice.cresaleno = invoice.customer.cresaleno;

			invoice.dorder = new Date(original_invoice.dorder);
			invoice.dinvoice = new Date(original_invoice.dinvoice);
			// invoice.dorder = original_invoice.dorder;
			// $("#invoice_order_date").val(original_invoice.dorder);
			// invoice.dinvoice = original_invoice.dinvoice;
			// $("#invoice_invoice_date").val(original_invoice.dinvoice);
			$rootScope.order_date_status = true;
			$rootScope.invoice_date_status = true;

			invoice.currency = original_invoice.nxchgrate;
			invoice.subtotal = parseFloat(original_invoice.nfsalesamt).toFixed(2);
			invoice.total_discount = original_invoice.nfdiscamt;
			invoice.overwrite_sales_tax = original_invoice.nftaxamt1;
			invoice.total = original_invoice.nfbalance;
			invoice.freight = original_invoice.nffrtamt;

			invoice.adjustment = original_invoice.nadjamt;

			invoice.address1 = {};
			invoice.address1.ccompany = original_invoice.cbcompany;
			invoice.address1.caddr1 = original_invoice.cbaddr1;
			invoice.address1.caddr2 = original_invoice.cbaddr2;
			invoice.address1.ccity = original_invoice.cbcity;
			invoice.address1.cstate = original_invoice.cbstate;
			invoice.address1.czip = original_invoice.cbzip;
			invoice.address1.ccountry = original_invoice.cbcountry;
			invoice.address1.cphone = original_invoice.cbphone;
			invoice.address1.ccontact = original_invoice.cbcontact;

			invoice.address2 = {};
			invoice.address2.ccompany = original_invoice.cscompany;
			invoice.address2.caddr1 = original_invoice.csaddr1;
			invoice.address2.caddr2 = original_invoice.csaddr2;
			invoice.address2.ccity = original_invoice.cscity;
			invoice.address2.cstate = original_invoice.csstate;
			invoice.address2.czip = original_invoice.cszip;
			invoice.address2.ccountry = original_invoice.cscountry;
			invoice.address2.cphone = original_invoice.csphone;
			invoice.address2.ccontact = original_invoice.cscontact;

			invoice.notepad = original_invoice.notepad;

			original_invoice.items.forEach(function (original_item) {
				var item = {};
				item.id = original_item.id;
				item.to_update = true; // flag to indicate that this item its already created in DB (aritrs)
				item.deleted = false; // flag to indicate that if in save we will delete this item
				item.citemno = original_item.citemno;
				item.cdescript = original_item.cdescript;
				item.shipqty = ((Number(original_item.nshipqty) < 0) ? Number(original_item.nshipqty) * -1 : Number(original_item.nshipqty));
				item.nprice = original_item.nfprice;
				item.discount = original_item.ndiscrate;
				// item.extended = ((item.shipqty * item.nprice) - ((item.shipqty * item.nprice) * (item.discount / 100))).toFixed(2);

				invoice.items.push(item);
			});

			$scope.invoice = invoice;

		});
	};

	$scope.deleteInvoice = function () {
		var payload = {
			"id": $scope.invoice.id,
			"active": 0
		};
		GenericFactory.put("arinvoice", payload, custom_headers).then(function (response) {
			if (response.status) {
				swal({
					title: "Success!",
					text: "Invoice deleted successfully",
					type: "success"
				});
			}
		});
	};

	$scope.clearInvoice = function () {
		$scope.invoice = {
			"items": []
		};
		$state.go("ar_invoice_setup");
	};

}]);

app.controller('SalesReturnWithInvoicePreviewController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = false;
}]);

app.controller('SalesReturnWithoutInvoiceLineItemsController', ["$scope", "$rootScope", "$state", "$timeout", "GenericFactory", function ($scope, $rootScope, $state, $timeout, GenericFactory) {

	$rootScope.enable_print_invoice_preview = true;

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.current_item_to_search = {};

	// Object to show extra info
	$scope.selected_item = {};

	$scope.addEmptyItem = function () {
		$scope.invoice.items.push({
			"discount": 0,
			"shipqty": 1
		});
	};

	$scope.searchStockItem = function (table_row_item) {

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

		$scope.invoice.items[$index].deleted = true;
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

app.controller('SalesReturnWithoutInvoiceInformationController', ["$scope", "$rootScope", function ($scope, $rootScope) {
	$rootScope.enable_print_invoice_preview = true;


	$scope.openSalesPersonModal = function () {
		$("#SelectSalesPersonModal").modal("show");
	};

	$scope.selectSalesPerson = function (salesperson) {
		$scope.invoice.salesperson = salesperson;
		$("#SelectSalesPersonModal").modal("hide");
	};

	$scope.openRemarkModal = function () {
		$("#SelectRemarkModal").modal("show");
	};

	$scope.selectRemark = function (remark) {
		$scope.invoice.remark = remark;
		$("#SelectRemarkModal").modal("hide");
	};

	// Plugins
	$("#ship_via_select").select2();
	$("#fob_select").select2();
	$("#warehouse_select").select2();
	$("#remark_select").select2();


	// $('#invoice_order_date').formatter({
	//     'pattern': '{{99}}/{{99}}/{{9999}}',
	//     'persistent': true
	// });
	// $('#invoice_invoice_date').formatter({
	//     'pattern': '{{99}}/{{99}}/{{9999}}',
	//     'persistent': true
	// });

}]);

app.controller('SalesReturnWithoutInvoiceNotepadController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = true;
}]);

app.controller('SalesReturnWithoutInvoicePaymentController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = true;

	$scope.openPayCodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (paycode) {
		$scope.invoice.customer.cpaycode = paycode.cpaycode;
		$scope.invoice.cbankno = paycode.cbankno;
		$("#SelectPaycodeModal").modal("hide");
	};

	$scope.openAddressModal = function (n_address) {
		$scope.selecting_address_n = n_address;
		$("#SelectAddressModal").modal("show");
	};

	$scope.selectAddress = function (address) {
		if ($scope.selecting_address_n == 1) {
			$scope.invoice.address1 = address;
		} else {
			$scope.invoice.address2 = address;
		}
		$("#SelectAddressModal").modal("hide");
	};

	$scope.openTaxModal = function () {
		$("#SelectSaleTaxModal").modal("show");
	};

	$scope.selectTax = function (tax) {
		$scope.invoice.sales_tax = tax;
		$("#SelectSaleTaxModal").modal("hide");
	};
	
}]);

app.controller('SalesReturnWithoutInvoicePreviewController', ["$scope", "$rootScope", "$state", function ($scope, $rootScope, $state) {
	$rootScope.enable_print_invoice_preview = false;
}]);

app.directive("invoiceDate", ["$rootScope", function ($rootScope) {
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

app.directive("invoiceDate", ["$rootScope", function ($rootScope) {
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
