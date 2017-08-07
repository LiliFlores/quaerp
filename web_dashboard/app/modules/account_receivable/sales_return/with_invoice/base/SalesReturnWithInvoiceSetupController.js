app.controller('SalesReturnWithInvoiceSetupController', ["$scope", "$rootScope", "$timeout", "$state", "$q", "GenericFactory", function($scope, $rootScope, $timeout, $state, $q, GenericFactory) {

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

    $scope.$watch("invoice", function() {
        // console.log($scope.invoice);
    }, 1);

    $scope.$watch('invoice.items', function() {

        $scope.invoice.subtotal = 0;
        $scope.invoice.total_discount = 0;
        $scope.invoice.items.forEach(function(item, index) {
            if (!item.deleted) {
                $scope.invoice.subtotal += (item.shipqty * item.nprice);
                $scope.invoice.total_discount += (item.shipqty * item.nprice) * (item.discount / 100);
            }
        });

        $scope.invoice.subtotal = ($scope.invoice.subtotal * -1).toFixed(2);
        $scope.invoice.total_discount = ($scope.invoice.total_discount * -1).toFixed(2);

        $scope.calculateOverwriteSalesTax();
        $timeout(function(){
            $scope.calculateInvoiceTotal();
        });

    }, 1);

    $scope.invoice = {};
    $scope.invoice.items = [];
    $scope.invoice.corderby = $rootScope.logged_user.name;

    if (typeof($scope.invoice.freight) == "undefined") {
        $scope.invoice.freight = 0;
    }
    if (typeof($scope.invoice.adjustment) == "undefined") {
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
    var paycode_prom = GenericFactory.get("arpycd", "", custom_headers);
    var cusaddr_prom = GenericFactory.get("arcadr", "", custom_headers);
    var saletax_prom = GenericFactory.get("costax", "", custom_headers);
    var exchangerate_prom = GenericFactory.get("cocurr", "", custom_headers);
    var invoice_prom = GenericFactory.get("arinvoice", "limit/-1", custom_headers);


    customer_prom.then(function(response) {
        if (response.status) {
            $scope.customer_list = response.results;
        }

        return fob_prom;
    }).then(function(response) {
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
    }).then(function(response) {
        if (response.status) {
            $scope.salesperson_list = response.results;
        }

        return remark_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.remark_list = response.results;
        }

        return item_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.item_list = response.results;
        }

        return paycode_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.paycode_list = response.results;
        }

        return cusaddr_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.cusaddr_list = response.results;
        }

        return saletax_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.saletax_list = response.results;
        }

        return exchangerate_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.exchangerate_list = response.results;
        }

        // TEST
        $scope.updateCustomerData();

        return invoice_prom;
    }).then(function(response) {
        if (response.status) {
            $scope.invoice_list = response.results;
            console.log($scope.invoice_list);
        }
    });

    $scope.openInvoiceModal = function() {
        $("#SelectInvoiceModal").modal("show");
    };

    $scope.selectInvoice = function(invoice) {
        $scope.amend_invoice.invoice_to_search = invoice.cinvno;
        $scope.searchInvoice();
        $("#SelectInvoiceModal").modal("hide");
    };

    $scope.changeInvoiceMode = function() {
        if ($scope.invoice_action == "amend") {
            $scope.invoice = {
                "items": []
            };
        }
    };

    $scope.updateCustomerData = function() {

        if (typeof($scope.invoice.customer) != "undefined") {
            let customer = angular.copy($scope.invoice.customer);

            $scope.invoice.warehouse = {};
            $scope.invoice.address1 = {};
            $scope.invoice.address2 = {};
            $scope.invoice.sales_tax = {};
            $scope.invoice.cresaleno = "";
            $scope.invoice.cresaleno = $scope.invoice.customer.cresaleno;
            $scope.invoice.corderby = $scope.invoice.customer.corderby;

            // Load default warehouse
            $scope.warehouse_list.forEach(function(warehouse) {
                if (customer.cwarehouse == warehouse.cwarehouse) {
                    $scope.invoice.warehouse = warehouse;
                    return;
                }
            });

            // Load default address 1 & 2
            var selected_both_address = false;
            $scope.cusaddr_list.forEach(function(address) {
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
            $scope.saletax_list.forEach(function(saletax) {
                if (customer.ctaxcode == saletax.centity1) {
                    $scope.invoice.sales_tax = saletax;
                    return;
                }
            });

            // Load default exchange rate
            $scope.exchangerate_list.forEach(function(exchange_rate) {
                if (customer.ccurrcode == exchange_rate.ccurrcode) {
                    $scope.invoice.currency = exchange_rate.nxchgrate;
                    return;
                }
            });
        }

    };

    $scope.calculateOverwriteSalesTax = function() {

        $timeout(function(){
            if (typeof($scope.invoice.sales_tax) == "undefined") {
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

    $scope.calculateInvoiceTotal = function() {
        $scope.invoice.total = ($scope.invoice.subtotal - $scope.invoice.total_discount + parseFloat($scope.invoice.overwrite_sales_tax) + parseFloat($scope.invoice.freight) + parseFloat($scope.invoice.adjustment)).toFixed(2);
    };


    // Invoice manager toolbar [ Save ] [ Void ] [ Copy ] [ Clear ] [ Close ] [ Print ]

    $scope.saveInvoice = function() {

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

                arsyst_prom.then(function(response) {
                    if (response.status) {

                        payload.ctype = "R";
                        payload.coriginvno = invoice.cinvno;
                        payload.active = true;
                        payload.cinvno = parseInt(response.results[0].next_invoice);
                        payload.cwarehouse = ((typeof(invoice.warehouse) != "undefined") ? invoice.warehouse.cwarehouse : null);
                        payload.cpaycode = invoice.customer.cpaycode;
                        payload.sidemarkno = invoice.sidemarkno;
                        payload.sono = invoice.sono;
                        payload.corderby = invoice.corderby;
                        payload.cslpnno = ((typeof(invoice.salesperson) != "undefined") ? invoice.salesperson.cslpnno : null);
                        payload.cshipvia = ((typeof(invoice.ship_via) != "undefined") ? invoice.ship_via.description : null);
                        payload.cfob = ((typeof(invoice.fob) != "undefined") ? invoice.fob.code : null);
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

                        payload.remark = ((typeof(invoice.remark) != "undefined") ? invoice.remark.code : null);

                        var create_remark = true;
                        $scope.remark_list.forEach(function(remark) {
                            if (remark.code == payload.remark) {
                                create_remark = false;
                                return;
                            }
                        });

                        if (create_remark) {
                            GenericFactory.post("arirmk", invoice.remark, custom_headers);
                        }

                        payload.costax = ((typeof(invoice.sales_tax) != "undefined") ? invoice.sales_tax.id : null);
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
                        new_invoice_prom.then(function(response) {
                            if (response.status) {

                                invoice.items.forEach(function(item) {
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
                                arsyst_next_invoice_prom.then(function(response) {
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

                                        GenericFactory.get("arirmk", "", custom_headers).then(function(response) {
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

    $scope.searchInvoice = function() {
        var invoice_no = $scope.amend_invoice.invoice_to_search;

        var original_invoice = {};
        original_invoice.items = [];

        var search_query = "cinvno/{0}".format(invoice_no);
        var search_invoice_prom = GenericFactory.get("arinvoice", search_query, custom_headers);
        var invoice_items_prom = GenericFactory.get("aritrs", "limit/-1", custom_headers);

        search_invoice_prom.then(function(response) {
            if (response.status) {
                original_invoice = angular.extend(original_invoice, response.results[0]);
            }

            return invoice_items_prom;
        }).then(function(response) {
            if (response.status) {
                response.results.forEach(function(item) {
                    if (item.cinvno == original_invoice.cinvno) {
                        original_invoice.items.push(item);
                    }
                });
            }

            var invoice = {};
            invoice.items = [];
            $scope.warehouse_list.forEach(function(warehouse) {
                if (original_invoice.cwarehouse == warehouse.cwarehouse) {
                    invoice.warehouse = warehouse;
                    return;
                }
            });
            $scope.salesperson_list.forEach(function(salesperson) {
                if (original_invoice.cslpnno == salesperson.cslpnno) {
                    invoice.salesperson = salesperson;
                    return;
                }
            });
            $scope.shipvia_list.forEach(function(ship_via) {
                if (original_invoice.cshipvia == ship_via.description) {
                    invoice.ship_via = ship_via;
                    return;
                }
            });
            $scope.fob_list.forEach(function(fob) {
                if (original_invoice.cfob == fob.code) {
                    invoice.fob = fob;
                    return;
                }
            });
            $scope.remark_list.forEach(function(remark) {
                if (original_invoice.remark == remark.code) {
                    invoice.remark = remark;
                    return;
                }
            });
            $scope.saletax_list.forEach(function(sales_tax) {
                if (original_invoice.costax == sales_tax.id) {
                    invoice.sales_tax = sales_tax;
                    return;
                }
            });
            $scope.customer_list.forEach(function(customer) {
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

            original_invoice.items.forEach(function(original_item) {
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

    $scope.deleteInvoice = function() {
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

    $scope.clearInvoice = function() {
        $scope.invoice = {
            "items": []
        };
        $state.go("ar_invoice_setup");
    };

}]);
