app.controller('CustomerAddressController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function($scope, $rootScope, $state, GenericFactory, Alertify) {
    // Browser title
    $rootScope.page_title = "address";

    // $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

    $scope.address = {};

    var custom_headers = {
        headers: {
            "db-name": $rootScope.syst_selected_company.db_schema
        }
    };

    $scope.address_list = [];
    $scope.loadAddressList = function() {
        GenericFactory.get("arcadr", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.address_list = response.results;
            }
        });
    };
    $scope.loadAddressList();

    $scope.customer_list = [];
    $scope.loadClientList = function() {
        GenericFactory.get("arcust", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.customer_list = response.results;
            }
        });
    };
    $scope.loadClientList();

    $scope.invoice_list = [];
    $scope.loadInvoiceList = function() {
        GenericFactory.get("arinvoice", "", custom_headers).then(function(response) {
            if (response.status) {
                $scope.invoice_list = response.results;
            }
        });
    };
    $scope.loadInvoiceList();

    $scope.openClientModal = function() {
        $("#SelectCustomerModal").modal("show");
    };

    $scope.selectCustomer = function(customer) {
        $scope.customer = angular.copy(customer);
        var customer = angular.copy(customer);

        $scope.address.ccustno = customer.ccustno;
        $scope.address.ccompany = customer.ccompany;
        // $scope.address.caddrno = customer.ccompany.split(" ")[0][0] + "01";
        $scope.address.caddr1 = customer.caddr1;
        $scope.address.caddr2 = customer.caddr2;
        $scope.address.ccity = customer.ccity;
        $scope.address.cstate = customer.cstate;
        $scope.address.czip = customer.czip;
        $scope.address.ccountry = customer.ccountry;
        $scope.address.cphone = customer.cphone1;

        $("#SelectCustomerModal").modal("hide");
    };

    $scope.openAddressModal = function() {
        $("#SelectAddressModal").modal("show");
    };

    $scope.selectAddress = function(address) {
        $scope.customer = {};
        var address = angular.copy(address);
        $scope.customer.ccompany = address.ccompany;

        $scope.address.id = address.id;
        $scope.address.ccustno = address.ccustno;
        $scope.address.ccompany = address.ccompany;
        // $scope.address.caddrno = address.ccompany.split(" ")[0][0] + "01";
        $scope.address.caddr1 = address.caddr1;
        $scope.address.caddr2 = address.caddr2;
        $scope.address.ccity = address.ccity;
        $scope.address.cstate = address.cstate;
        $scope.address.czip = address.czip;
        $scope.address.ccountry = address.ccountry;
        $scope.address.ccontact = address.ccontact;
        $scope.address.cphone = address.cphone;

        $("#SelectAddressModal").modal("hide");
    };

    $scope.saveAddress = function() {
        var payload = angular.copy($scope.address);

        if (payload.ccompany && payload.caddrno && payload.caddr1) {

            var address_already_used = false;
            var cust_list = [];
            $scope.address_list.forEach(function(address) {

                if (address.ccustno != payload.ccustno) {
                    if (address.caddrno == payload.caddrno) {
                        address_already_used = true;
                    }
                }

                if (address_already_used) {
                    return true;
                }
            });


            if (address_already_used) {
                var message = "";

                message = "The selected address ID is already been used with another client";

                swal({
                    title: "Hold on cowboy!",
                    text: message,
                    type: "warning"
                });
            } else {
                GenericFactory.post("arcadr", payload, custom_headers).then(function(response) {
                    if (response.status) {
                        $scope.loadAddressList();
                        $scope.customer = {};
                        $scope.address = {};
                        swal({
                            title: "Success!",
                            text: "You have added a new Address",
                            type: "success"
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
            }

        } else {
            swal({
                title: "Error!",
                text: "Please, at least fill the Company, Address NO & Address fields",
                type: "error"
            });
        }

    };

    $scope.deleteAddress = function() {

        var address_in_customer = false;
        var customer_name_list = [];
        $scope.customer_list.some(function(customer) {
            // console.log(customer.caddr1);
            // console.log($scope.address.caddr1);
            // return 1;
            if (customer.caddr1 == $scope.address.caddr1) {
                // console.log(":D");
                address_in_customer = true;
                customer_name_list.push(customer.ccompany);
                // return 1;
            }
        });

        // console.log(address_in_customer);
        // console.log(address_name_list);
        // throw new Error();

        if (address_in_customer) {
            // console.log(invoice_id_list);
            // console.log(invoice_id_list.length);
            var message = "";
            if (customer_name_list.length == 1) {
                message = "The selected address is already been used in the following customer: {0}".format(customer_name_list);
            } else {
                message = "The selected address is already been used in the following customers: {0}".format(customer_name_list);
            }
            // console.log(message);
            swal({
                title: "Hold on cowboy!",
                text: message,
                type: "warning"
            });
        } else {
            GenericFactory.delete("arcadr", $scope.address.id, custom_headers).then(function(response) {
                if (response.status) {
                    $scope.loadAddressList();
                    $scope.address = {};
                    $scope.customer = {};
                    swal({
                        title: "Success!",
                        text: "You have deleted the address",
                        type: "success"
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
        }
    };

    $scope.updateAddress = function() {
        var payload = angular.copy($scope.address);
        GenericFactory.put("arcadr", payload, custom_headers).then(function(response) {
            if (response.status) {
                $scope.loadAddressList();
                $scope.address = {};
                $scope.customer = {};
                swal({
                    title: "Success!",
                    text: "You have updated the address",
                    type: "success"
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
    };

    $scope.clearAddressForm = function() {
        $scope.address = {};
        $scope.customer = {};
        Alertify.log("Address form has been cleaned successfully");
    };


    // $scope.address_list = [];
    // $scope.loadaddressList = function() {
    //     GenericFactory.get("arirmk", "", custom_headers).then(function(response) {
    //         if (response.status) {
    //             $scope.address_list = response.results;
    //         }
    //     });
    // };
    // $scope.loadaddressList();
    //
    // $scope.invoice_list = [];
    // $scope.loadInvoiceList = function() {
    //     GenericFactory.get("arinvoice", "", custom_headers).then(function(response) {
    //         if (response.status) {
    //             $scope.invoice_list = response.results;
    //         }
    //     });
    // };
    // $scope.loadInvoiceList();
    //
    // $scope.openaddressModal = function() {
    //     $("#SelectaddressModal").modal("show");
    // };
    //
    // $scope.selectaddress = function(address) {
    //     $scope.address = angular.copy(address);
    //     $("#SelectaddressModal").modal("hide");
    // };
    //
    // $scope.saveaddress = function() {
    //     var payload = angular.copy($scope.address);
    //
    //     if (payload.code && payload.addresss) {
    //         GenericFactory.post("arirmk", payload, custom_headers).then(function(response) {
    //             if (response.status) {
    //                 $scope.loadaddressList();
    //                 $scope.address = {};
    //                 swal({
    //                     title: "Success!",
    //                     text: "You have added a new address",
    //                     type: "success"
    //                 });
    //             } else {
    //                 console.log(response);
    //                 swal({
    //                     title: "Error!",
    //                     text: "Please, contact admin.",
    //                     type: "error"
    //                 });
    //             }
    //         });
    //     } else {
    //         swal({
    //             title: "Error!",
    //             text: "Please, fill the form.",
    //             type: "error"
    //         });
    //     }
    //
    // };
    //
    // $scope.deleteaddress = function() {
    //
    //     var address_in_invoice = false;
    //     var invoice_id_list = [];
    //     $scope.invoice_list.some(function(invoice) {
    //         if (invoice.address == $scope.address.code) {
    //             address_in_invoice = true;
    //             invoice_id_list.push(invoice.cinvno);
    //             // return 1;
    //         }
    //     });
    //
    //     if (address_in_invoice) {
    //         // console.log(invoice_id_list);
    //         // console.log(invoice_id_list.length);
    //         var message = "";
    //         if (invoice_id_list.length == 1) {
    //             message = "The selected address is already been used in the following invoice: {0}".format(invoice_id_list);
    //         } else {
    //             message = "The selected address is already been used in the following invoices: {0}".format(invoice_id_list);
    //         }
    //         // console.log(message);
    //         swal({
    //             title: "Hold on cowboy!",
    //             text: message,
    //             type: "warning"
    //         });
    //     } else {
    //         GenericFactory.delete("arirmk", $scope.address.id, custom_headers).then(function(response) {
    //             if (response.status) {
    //                 $scope.loadaddressList();
    //                 $scope.address = {};
    //                 swal({
    //                     title: "Success!",
    //                     text: "You have deleted the address",
    //                     type: "success"
    //                 });
    //             } else {
    //                 console.log(response);
    //                 swal({
    //                     title: "Error!",
    //                     text: "Please, contact admin.",
    //                     type: "error"
    //                 });
    //             }
    //         });
    //     }
    // };
    //
    // $scope.updateaddress = function() {
    //     var payload = angular.copy($scope.address);
    //     GenericFactory.put("arirmk", payload, custom_headers).then(function(response) {
    //         if (response.status) {
    //             $scope.loadaddressList();
    //             $scope.address = {};
    //             swal({
    //                 title: "Success!",
    //                 text: "You have updated the address",
    //                 type: "success"
    //             });
    //         } else {
    //             console.log(response);
    //             swal({
    //                 title: "Error!",
    //                 text: "Please, contact admin.",
    //                 type: "error"
    //             });
    //         }
    //     });
    // };
    //
    // $scope.clearaddressForm = function() {
    //     $scope.address = {};
    //     Alertify.log("address form has been cleaned successfully");
    // };


}]);
