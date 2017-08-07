app.controller('ApplyPaymentController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", "$timeout", function($scope, $rootScope, $state, GenericFactory, Alertify, $timeout) {
    // Browser title
    $rootScope.page_title = "Apply Payment";

    // $rootScope.syst_selected_company = {
    //     "id": "6",
    //     "cid": "inc",
    //     "name": "Qualfin INC",
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
    //     "db_schema": "inc_dbxyz",
    //     "created": "2017-02-01 12:47:25",
    //     "updated": null
    // };
    // $rootScope.syst_selected_company = {"id": "7","cid": "sapi","name": "Qualfin SAPI","address": "address1","city": "city1","state": "state1","zip": "42315","phone": "1234567890","subdirectory": "subdirectory1","nofp": "2","df": "American","hcurrency": "USD","fdofd": "05/20/1994","cfy": "2007","sta": "USA","db_hostname": "11.11.11.11","db_port": "3306","db_username": "erick","db_password": "password","db_schema": "sapi_db","created": "2017-02-02 10:12:27","updated": null};

    function isOverapply() {
        var totals_paid_amount = Number($scope.totals.paid_ammount);
        var totals_apply_amount = Number($scope.totals.apply_ammount);

        var status = false;
        if (totals_apply_amount > totals_paid_amount) {
            status = true;
        }

        return status;
    }

    // $scope.$watch("totals", function() {
    //
    //     var is_overapply = isOverapply();
    //     if (is_overapply) {
    //         swal({
    //             title: "Overapply!",
    //             type: "error"
    //         });
    //     }
    //
    // }, 1);

    $scope.payment_form = {};
    $scope.totals = {
        "fin_charge": 0,
        "balance": 0,
        "apply_ammount": 0,
        "adjustment": 0,
        "unapply_bal": 0,
        "paid_ammount": 0,
        "open_credit": 0,
        "apply_open_credit": 0
    };
    $scope.enable_save_button = false;

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.arsyst_config = {};

    function loadSystemSettings() {
        GenericFactory.get("arsyst", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.arsyst_config = response.results[0];
                console.log("system settings:");
                console.log($scope.arsyst_config);
            }
        });
    }
    loadSystemSettings();

    $scope.customer_list = [];
    GenericFactory.get("arcust", "", custom_headers).then(function(response) {
        if (response.status) {
            $scope.customer_list = response.results;
        }
    });

    $scope.paycode_list = [];
    GenericFactory.get("arpycd", "", custom_headers).then(function(response) {
        if (response.status) {
            $scope.paycode_list = response.results;
        }
    });

    $scope.bank_list = [];
    GenericFactory.get("cobank", "", custom_headers).then(function(response) {
        if (response.status) {
            $scope.bank_list = response.results;
        }
    });

    $scope.cash_list = [];

    function loadCashList() {
        GenericFactory.get("arcash", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.cash_list = response.results;
                calculateOpenCredit();
            }
        });
    }

    function calculateOpenCredit() {
        // cash.ccustno == payment_form.ccustno && (cash.npaidamt - cash.nappamt) != 0
        $scope.cash_list.forEach(function(cash) {
            if (cash.ccustno == $scope.payment_form.ccustno) {
                $scope.totals.open_credit += (cash.npaidamt - cash.nappamt);
            }
        });
    };

    $scope.calculateApplyOpenCredit = function() {
        $scope.totals.apply_open_credit = 0;
        $scope.cash_list.forEach(function(cash) {
            if (cash.ccustno == $scope.payment_form.ccustno && typeof(cash.apply_amount) != "undefined") {
                $scope.totals.apply_open_credit += Number(cash.apply_amount);
            }
        });
    };

    $scope.calculateApplyAmountTotal = function() {

        var inv_list = $scope.invoice_list;
        var total_play_amount = 0;
        for (var i = 0; i < inv_list.length; i++) {
            var current_invoice = inv_list[i];
            total_play_amount += Number(current_invoice.apply_amount);
        }
        $scope.totals.apply_ammount = total_play_amount.toFixed(2);

        if (Number($scope.totals.apply_open_credit) == 0) {

            if (Number($scope.totals.apply_ammount) > Number($scope.totals.paid_ammount)) {
                var diff = ((Number($scope.totals.paid_ammount) - Number($scope.totals.apply_ammount)) * -1).toFixed(2);
                var message = "Overapply by {0}".format(diff);
                alertify.error(message);
            }

        }

    }

    $scope.invoice_list = [];

    function loadInvoiceList(customer_no) {
        var query = "ccustno/{0}/limit/-1".format(customer_no);
        GenericFactory.get("arinvoice", query, custom_headers).then(function(response) {
            if (response.status) {

                for (var i = 0; i < response.results.length; i++) {
                    var current_invoice = response.results[i];

                    var balance = Number(current_invoice.nbalance);
                    if (balance > 0) {
                        var nsalesamt = current_invoice.nsalesamt;
                        var ntotpaid = ((typeof(current_invoice.ntotpaid) == "undefined") ? 0 : current_invoice.ntotpaid);
                        $scope.totals.balance += Number(nsalesamt - ntotpaid);
                        current_invoice.apply_amount = 0;
                        $scope.invoice_list.push(current_invoice);
                    }

                    $scope.enable_save_button = true;
                }

                $scope.totals.balance = ($scope.totals.balance).toFixed(2);
                // $scope.totals.balance = $scope.totals.balance;
            } else {
                alertify.error("Invoice not found in the current client");
            }
        });
    };

    $scope.card_list = [];

    function loadCardList(customer_no) {
        var query = "ccustno/{0}/limit/-1".format(customer_no);
        GenericFactory.get("arcard", query, custom_headers).then(function(response) {
            if (response.status) {
                $scope.card_list = response.results;
            } else {
                alertify.error("It looks like this customer does not have any cards");
            }
        });
    };

    $scope.openClientModal = function() {
        $("#SelectCustomerModal").modal("show");
    };

    $scope.selectCustomer = function(customer) {
        $("#SelectCustomerModal").modal("hide");

        $scope.payment_form.ccustno = customer.ccustno;
        $scope.payment_form.ccompany = customer.ccompany;
        $scope.payment_form.caddr1 = customer.caddr1;
        $scope.payment_form.caddr2 = customer.caddr2;
        $scope.payment_form.ccity = customer.ccity;
        $scope.payment_form.cstate = customer.cstate;
        $scope.payment_form.czip = customer.czip;
        $scope.payment_form.cphone1 = customer.cphone1;
        $scope.payment_form.ccurrcode = customer.ccurrcode;
        $scope.payment_form.cpaycode = customer.cpaycode;


        loadInvoiceList($scope.payment_form.ccustno);
        loadCardList($scope.payment_form.ccustno);
        loadCashList();
    };

    $scope.openCardModal = function() {
        $("#SelectCardModal").modal("show");
    };

    $scope.selectCard = function(card) {
        $("#SelectCardModal").modal("hide");
        $scope.payment_form.ccardno = card.ccardno;
    };

    $scope.openBankModal = function() {
        $("#SelectBankModal").modal("show");
    };

    $scope.selectBank = function(bank) {
        $("#SelectBankModal").modal("hide");
        // console.log(bank);
        $scope.payment_form.cbankno = bank.id;
    };

    $scope.openPaycodeModal = function() {
        $("#SelectPaycodeModal").modal("show");
    };

    $scope.selectPaycode = function(paycode) {
        $("#SelectPaycodeModal").modal("hide");

        $scope.payment_form.cpaycode = paycode.cpaycode;
    };

    $scope.openOpenCreditModal = function() {
        $("#OpenCreditModal").modal("show");
    };

    $scope.openApplyOpenCreditModal = function() {
        $("#ApplyOpenCreditModal").modal("show");
    };

    $scope.copyBalanceToApplyAmount = function(invoice) {
        var nsalesamt = invoice.nsalesamt;
        var ntotpaid = ((typeof(invoice.ntotpaid) == "undefined") ? 0 : invoice.ntotpaid);
        invoice.apply_amount = nsalesamt - ntotpaid;
    };

    $scope.copyBalanceToApplyAmountTotal = function() {
        $scope.totals.apply_ammount = $scope.totals.balance;
    };

    $scope.savePayment = function() {

        /*
        var is_overapply = isOverapply();
        if (is_overapply) {
            swal({
                title: "Overapply!",
                type: "error"
            });
        } else {
        */
        // required inputs
        var messages_list = [];
        var status = true;

        if ($scope.payment_form.cbankno == "" || typeof($scope.payment_form.cbankno) == "undefined") {
            status = false;
            messages_list.push("Bank # is required");
        }

        if (status) {

            var pay_with_credit = false;
            if (Number($scope.totals.apply_open_credit) > 0) {
                pay_with_credit = true;
            }

            var deposit_date_obj = new Date($scope.payment_form.deposit_date);
            var deposit_date = "{0}-{1}-{2}".format(
                deposit_date_obj.getFullYear(),
                deposit_date_obj.getMonth() + 1,
                deposit_date_obj.getDate()
            );

            var currency_code = "";
            for (var i = 0; i < $scope.invoice_list.length; i++) {
                var current_invoice = $scope.invoice_list[i];

                if (current_invoice.apply_amount > 0) {

                    // var arcash_payload = {};
                    var arcapp_payload = {};
                    var invoice_payload = {};
                    var arsyst_payload = {};
                    var today = new Date();
                    var nxchgrate = Number(current_invoice.nxchgrate);
                    currency_code = current_invoice.ccurcode;

                    arcapp_payload.crcptno = $scope.arsyst_config.crcptno;
                    arcapp_payload.ccustno = $scope.payment_form.ccustno;
                    arcapp_payload.cinvno = current_invoice.cinvno;
                    arcapp_payload.ndiscmt = current_invoice.ndiscmt;
                    arcapp_payload.nadjamt = current_invoice.nadjamt;
                    arcapp_payload.nfadjamt = Number(current_invoice.nadjamt) * nxchgrate;
                    arcapp_payload.caracc = $scope.arsyst_config.account_receivables
                    arcapp_payload.cdiscacc = $scope.arsyst_config.payment_term_discount;
                    arcapp_payload.cadjacc = $scope.arsyst_config.payment_adjustements;
                    arcapp_payload.cdebtacc = $scope.arsyst_config.bad_deb_expense;
                    arcapp_payload.dpaid = deposit_date;
                    arcapp_payload.npaidamt = current_invoice.apply_amount;
                    arcapp_payload.nfpaidamt = current_invoice.apply_amount * nxchgrate;
                    GenericFactory.post("arcapp", arcapp_payload, custom_headers);

                    invoice_payload.id = current_invoice.id;

                    invoice_payload.ntotpaid = Number(current_invoice.ntotpaid) + Number(current_invoice.apply_amount);
                    invoice_payload.nftotpaid = invoice_payload.ntotpaid * nxchgrate;
                    console.log(invoice_payload);
                    GenericFactory.put("arinvoice", invoice_payload, custom_headers);

                }

            }

            var message = "";

            if (pay_with_credit) {
                $scope.cash_list.forEach(function(cash) {
                    if (cash.ccustno == $scope.payment_form.ccustno && typeof(cash.apply_amount) != "undefined") {
                        // $scope.totals.open_credit += (cash.npaidamt - cash.nappamt);
                        var arcash_payload = {};
                        arcash_payload.id = cash.id;
                        arcash_payload.nappamt = Number(cash.nappamt) + Number(cash.apply_amount);
                        arcash_payload.nfappamt = arcash_payload.nappamt * nxchgrate;
                        GenericFactory.put("arcash", arcash_payload, custom_headers);
                    }
                });

                message = "Credit Applied";
            } else {
                var total_paid_ammount = Number($scope.totals.paid_ammount);
                var arcash_payload = {};
                arcash_payload.crcptno = $scope.arsyst_config.crcptno;
                arcash_payload.ccustno = $scope.payment_form.ccustno;
                arcash_payload.ccurrcode = $scope.payment_form.ccurrcode
                arcash_payload.cpaycode = $scope.payment_form.cpaycode;
                arcash_payload.cbankno = $scope.payment_form.cbankno;
                arcash_payload.ccardno = $scope.payment_form.ccardno;
                arcash_payload.cpayref = $scope.payment_form.reference;
                arcash_payload.ccurcode = currency_code;
                arcash_payload.dcreate = "{0}-{1}-{2}".format(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    today.getDate()
                );
                arcash_payload.dpaid = arcash_payload.dcreate;
                arcash_payload.npaidamt = total_paid_ammount;
                arcash_payload.nfpaidamt = total_paid_ammount * nxchgrate;
                arcash_payload.nappamt = $scope.totals.apply_ammount;
                arcash_payload.nfappamt = $scope.totals.apply_ammount * nxchgrate;
                arcash_payload.nxchgrate = nxchgrate;
                GenericFactory.post("arcash", arcash_payload, custom_headers);

                arsyst_payload.id = $scope.arsyst_config.id;
                arsyst_payload.crcptno = Number($scope.arsyst_config.crcptno) + 1;
                console.log("receip no: " + arsyst_payload.crcptno);
                GenericFactory.put("arsyst", arsyst_payload, custom_headers).then(function(response) {
                    loadSystemSettings();
                });

                message = "Payment receipt: {0}".format(arsyst_payload.crcptno);
            }


            $scope.payment_form = {};
            $scope.totals = {
                "fin_charge": 0,
                "balance": 0,
                "apply_ammount": 0,
                "adjustment": 0,
                "unapply_bal": 0
            };
            $scope.invoice_list = [];
            $scope.enable_save_button = false;

            loadCashList();

            swal({
                title: message,
                type: "success"
            });
            // alertify.success("Se realizo el pago");

        } else {

            var html_code = "<ul>{0}</ul>";
            var text_messages = "";
            messages_list.forEach(function(message) {
                var current_html = "<li style='text-align: left;'>{0}</li>".format(
                    message
                );
                text_messages += current_html;
            });

            html_code = html_code.format(text_messages);

            swal({
                title: "Fill all required inputs",
                text: html_code,
                html: true,
                type: "error"
            });
        }



    };

    $scope.triggerTab = function(keyEvent, index) {

        if (keyEvent.which === 13) {
            var element_id = "#amount_total{0}".format(index);
            var current_element = angular.element(element_id);
            var next_element_id = "#amount_total{0}".format(index + 1);
            var next_element = angular.element(next_element_id);

            next_element.focus();
        }

    };

}]);
