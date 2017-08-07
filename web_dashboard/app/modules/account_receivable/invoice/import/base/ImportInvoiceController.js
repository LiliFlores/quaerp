app.controller('ImportInvoiceController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {

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

    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    };

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.ship_via_list = [];
    GenericFactory.get("arfrgt", "", custom_headers).then(function(response) {
        if (response.status) {
            $scope.ship_via_list = response.results;
        }
    });

    $scope.customer_list = [];
    GenericFactory.get("arcust", "", custom_headers).then(function(response) {
        if (response.status) {
            $scope.customer_list = response.results;
        }
    });

    $scope.currency_list = [];
    GenericFactory.get("cocurr", "", custom_headers).then(function(response) {
        $scope.currency_list = response.results;
    });

    $scope.costax_list = [];
    GenericFactory.get("costax", "", custom_headers).then(function(response) {
        if (response.status) {
            $scope.costax_list = response.results;
        }
    });


    $scope.clickOnFileInput = function() {
        $("#fileInput").trigger("click");
    }

    $scope.current_file_name = "";

    $scope.valid_invoice_count = 0;
    $scope.invalid_invoice_count = 0;

    $scope.processInvoiceImportFile = function(file_content) {

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
        inv_list.forEach(function(invoice, index) {
            var current_invoice = invoice.split(",");

            if (current_invoice[0] == "*") {

                var customer = current_invoice[1];
                var customer_found = false;

                $scope.customer_list.forEach(function(cust, index) {
                    if (cust.ccustno == customer) {
                        $scope.invoice.customer = cust;

                        $scope.currency_list.forEach(function(currency) {
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

                    $scope.ship_via_list.every(function(ship_via, index) {
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

                if (typeof(inv_list[index + 1]) != "undefined") {
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

    $scope.validateInvoiceList = function() {

        var invoice_n_list = [];
        var valid_invoices = [];
        var invalid_invoices = [];
        $scope.invoice_list.forEach(function(invoice, index) {
            // console.log(invoice);
            if (invoice_n_list.indexOf(invoice.next_invoice) == -1) {
                var is_valid = true;

                if (typeof(invoice.customer) != "object") {
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
                invoice.items.forEach(function(item, index) {
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

    $scope.fileChanged = function() {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.$apply(function() {
                $scope.processInvoiceImportFile(reader.result);
            });
        };

        var txtFileInput = document.getElementById('fileInput');
        var txtFile = txtFileInput.files[0];
        if (typeof(txtFile) != "undefined") {
            $scope.current_file_name = txtFile.name;
            reader.readAsText(txtFile);
        }
    };

    $scope.addInvoices = function() {
        $scope.valid_invoice_list.forEach(function(invoice, index) {

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
            invoice.items.forEach(function(item) {
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

            add_invoice_prom.then(function(response) {
                if (response.status) {
                    invoice.items.forEach(function(item) {
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

                        GenericFactory.post("aritrs", invoice_item_payload, custom_headers).then(function(response) {
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
