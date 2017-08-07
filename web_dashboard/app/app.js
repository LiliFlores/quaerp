var app = angular.module("WebERP", ["ui.router", "ui.bootstrap", "ngFileUpload", 'datatables', 'ngResource', "Alertify", "lr.upload"]);
// , "ui.utils.masks"
// "ngMaterial",
app.directive('stringToNumber', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function (value) {
				return '' + value;
			});
			ngModel.$formatters.push(function (value) {
				return parseFloat(value);
			});
		}
	};
});

app.directive('decimalPlaces', function () {
	return {
		link: function (scope, ele, attrs) {
			ele.bind('keypress', function (e) {
				var newVal = $(this).val() + (e.charCode !== 0 ? String.fromCharCode(e.charCode) : '');
				if ($(this).val().search(/(.*)\.[0-9][0-9]/) === 0 && newVal.length > $(this).val().length) {
					e.preventDefault();
				}
			});
		}
	};
});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
   };
}]);
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl, name){
         var fd = new FormData();
         fd.append('file', file);
         fd.append('name', name);
         $http.post(uploadUrl, fd, {
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined,'Process-Data': false}
         })
         .success(function(){
            console.log("Success");
         })
         .error(function(){
            console.log("Success");
         });
     }
 }]);
app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

	$httpProvider.defaults.headers.common = {};
	$httpProvider.defaults.headers.post = {};
	$httpProvider.defaults.headers.put = {};
	$httpProvider.defaults.headers.patch = {};
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$urlRouterProvider.otherwise("/dashboard");

	$stateProvider.state("login", {
		url: "/login",
		views: {
			"content": {
				templateUrl: "modules/login/LoginView.html",
				controller: "LoginController"
			}
		}
	}).state("404", {
		url: "/404",
		views: {
			"content": {
				templateUrl: "modules/error/notFoundView.html",
				controller: "notFoundController"
			}
		}
	}).state("403", {
		url: "/403",
		views: {
			"content": {
				templateUrl: "modules/error/forbiddenView.html",
				controller: "forbiddenController"
			}
		}
	}).state("dashboard", {
		url: "/dashboard",
		views: {
			"content": {
				templateUrl: "modules/dashboard/DashboardView.html",
				controller: "DashboardController"
			}
		},
		resolve: {
			requireActiveSession: ["UserSession", function (UserSession) {
				return UserSession.verify();
			}]
		}
	}).state("sm_company_create", {
		url: "/sm/company/create",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/system_manager/company/CompanyCreateView.html",
				controller: "CompanyCreateController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("SM-01");
			}]
		}
	}).state("sm_company_edit", {
		url: "/sm/company/edit",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/system_manager/company/CompanyEditView.html",
				controller: "CompanyEditController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("SM-02");
			}]
		}
	}).state("sm_company_delete", {
		url: "/sm/company/delete",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/system_manager/company/CompanyDeleteView.html",
				controller: "CompanyDeleteController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("SM-03");
			}]
		}
	}).state("group_setup", {
		url: "/group_setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/system_manager/usergroup/GroupSetupView.html",
				controller: "GroupSetupController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("SM-04");
			}]
		}
	}).state("ar_setup", {
		url: "/ar/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/account_receivable/setup/base/ArSetupBaseView.html",
				controller: "ArSetupBaseController"
			},
			"ar_setup_content@ar_setup": {
				templateUrl: "modules/account_receivable/setup/general1/ArSetupGeneral1View.html",
				controller: "ArSetupGeneral1Controller"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-01", true);
			}]
		}
	}).state("ar_setup_general1", {
		url: "/general1",
		parent: "ar_setup",
		views: {
			"ar_setup_content": {
				templateUrl: "modules/account_receivable/setup/general1/ArSetupGeneral1View.html",
				controller: "ArSetupGeneral1Controller"
			}
		}
	}).state("ar_setup_general2", {
		url: "/general2",
		parent: "ar_setup",
		views: {
			"ar_setup_content": {
				templateUrl: "modules/account_receivable/setup/general2/ArSetupGeneral2View.html",
				controller: "ArSetupGeneral2Controller"
			}
		}
	}).state("ar_setup_finance_charge", {
		url: "/finance_charge",
		parent: "ar_setup",
		views: {
			"ar_setup_content": {
				templateUrl: "modules/account_receivable/setup/finance_charge/ArSetupFinanceChargeView.html",
				controller: "ArSetupFinanceChargeController"
			}
		}
	}).state("ar_setup_printing", {
		url: "/printing",
		parent: "ar_setup",
		views: {
			"ar_setup_content": {
				templateUrl: "modules/account_receivable/setup/printing/ArSetupPrintingView.html",
				controller: "ArSetupPrintingController"
			}
		}
	}).state("ar_setup_gl_accounts", {
		url: "/gl_accounts",
		parent: "ar_setup",
		views: {
			"ar_setup_content": {
				templateUrl: "modules/account_receivable/setup/gl_accounts/ArSetupGlAccountsView.html",
				controller: "ArSetupGlAccountsController"
			}
		}
	}).state("ar_invoice_setup", {
		url: "/ar/invoice/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/account_receivable/invoice/base/InvoiceSetupView.html",
				controller: "InvoiceSetupController"
			},
			"invoice_setup_content@ar_invoice_setup": {
				templateUrl: "modules/account_receivable/invoice/information/InvoiceSetupInformationView.html",
				controller: "InvoiceSetupInformationController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-02", true);
			}]
		}
	}).state("ar_invoice_setup_information", {
		url: "/information",
		parent: "ar_invoice_setup",
		views: {
			"invoice_setup_content": {
				templateUrl: "modules/account_receivable/invoice/information/InvoiceSetupInformationView.html",
				controller: "InvoiceSetupInformationController"
			}
		}
	}).state("ar_invoice_setup_line_items", {
		url: "/line_items",
		parent: "ar_invoice_setup",
		views: {
			"invoice_setup_content": {
				templateUrl: "modules/account_receivable/invoice/lineitems/InvoiceSetupLineItemsView.html",
				controller: "InvoiceSetupLineItemsController"
			}
		}
	}).state("ar_invoice_setup_payment", {
		url: "/payment",
		parent: "ar_invoice_setup",
		views: {
			"invoice_setup_content": {
				templateUrl: "modules/account_receivable/invoice/payment/InvoiceSetupPaymentView.html",
				controller: "InvoiceSetupPaymentController"
			}
		}
	}).state("ar_invoice_setup_notepad", {
		url: "/cnotepad",
		parent: "ar_invoice_setup",
		views: {
			"invoice_setup_content": {
				templateUrl: "modules/account_receivable/invoice/notepad/InvoiceSetupNotepadView.html",
				controller: "InvoiceSetupNotepadController"
			}
		}
	}).state("ar_invoice_preview", {
		url: "/preview",
		parent: "ar_invoice_setup",
		views: {
			"invoice_setup_content": {
				templateUrl: "modules/account_receivable/invoice/preview/InvoicePreviewView.html",
				controller: "InvoicePreviewController"
			}
		}
	}).state("ar_invoice_import_setup", {
		url: "/ar/invoice/import/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/account_receivable/invoice/import/base/ImportInvoiceView.html",
				controller: "ImportInvoiceController"
			},
			"invoice_import_setup_content@ar_invoice_import_setup": {
				templateUrl: "modules/account_receivable/invoice/import/valid/ImportValidInvoicesView.html",
				controller: "ImportValidInvoicesController"
			}
		}
	}).state("ar_invoice_import_valid", {
		url: "/valid",
		parent: "ar_invoice_import_setup",
		views: {
			"invoice_import_setup_content": {
				templateUrl: "modules/account_receivable/invoice/import/valid/ImportValidInvoicesView.html",
				controller: "ImportValidInvoicesController"
			}
		}
	}).state("ar_invoice_import_invalid", {
		url: "/invalid",
		parent: "ar_invoice_import_setup",
		views: {
			"invoice_import_setup_content": {
				templateUrl: "modules/account_receivable/invoice/import/invalid/ImportInvalidInvoicesView.html",
				controller: "ImportInvalidInvoicesController"
			}
		}
	}).state("customer_setup", {
		url: "/maintenance/customer/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/customer/base/CustomerSetupView.html",
				controller: "CustomerSetupController"
			},
			"customer_setup_content@customer_setup": {
				templateUrl: "modules/maintenance/customer/information/CustomerSetupInformationView.html",
				controller: "CustomerSetupInformationController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("customer_information", {
		url: "/information",
		parent: "customer_setup",
		views: {
			"customer_setup_content@customer_setup": {
				templateUrl: "modules/maintenance/customer/information/CustomerSetupInformationView.html",
				controller: "CustomerSetupInformationController"
			}
		}
	}).state("customer_contact", {
		url: "/contact",
		parent: "customer_setup",
		views: {
			"customer_setup_content@customer_setup": {
				templateUrl: "modules/maintenance/customer/contact/CustomerSetupContactView.html",
				controller: "CustomerSetupContactController"
			}
		}
	}).state("customer_notepad", {
		url: "/notepad",
		parent: "customer_setup",
		views: {
			"customer_setup_content@customer_setup": {
				templateUrl: "modules/maintenance/customer/notepad/CustomerSetupNotepadView.html",
				controller: "CustomerSetupNotepadController"
			}
		}
	}).state("customer_analysis", {
		url: "/analysis",
		parent: "customer_setup",
		views: {
			"customer_setup_content@customer_setup": {
				templateUrl: "modules/maintenance/customer/analysis/CustomerSetupAnalysisView.html",
				controller: "CustomerSetupAnalysisController"
			}
		}
	}).state("customer_settings", {
		url: "/settings",
		parent: "customer_setup",
		views: {
			"customer_setup_content@customer_setup": {
				templateUrl: "modules/maintenance/customer/settings/CustomerSetupSettingsView.html",
				controller: "CustomerSetupSettingsController"
			}
		}
	}).state("customer_gl_accounts", {
		url: "/glaccounts",
		parent: "customer_setup",
		views: {
			"customer_setup_content@customer_setup": {
				templateUrl: "modules/maintenance/customer/glaccounts/CustomerSetupGLAccountsView.html",
				controller: "CustomerSetupGLAccountsController"
			}
		}
	}).state("inventory_setup", {
		url: "/maintenance/inventory/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/inventory/base/InventorySetupView.html",
				controller: "InventorySetupController"
			},
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/information/InventorySetupInformationView.html",
				controller: "InventorySetupInformationController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("inventory_information", {
		url: "/information",
		parent: "inventory_setup",
		views: {
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/information/InventorySetupInformationView.html",
				controller: "InventorySetupInformationController"
			}
		}
	}).state("inventory_remarkimage", {
		url: "/remark",
		parent: "inventory_setup",
		views: {
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/remarkimage/InventorySetupRemarkImageView.html",
				controller: "InventorySetupRemarkImageController"
			}
		}
	}).state("inventory_analysis", {
		url: "/analysis",
		parent: "inventory_setup",
		views: {
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/analysis/InventorySetupAnalysisView.html",
				controller: "InventorySetupAnalysisController"
			}
		}
	}).state("inventory_notepad", {
		url: "/notepad",
		parent: "inventory_setup",
		views: {
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/notepad/InventorySetupNotepadView.html",
				controller: "InventorySetupNotepadController"
			}
		}
	}).state("inventory_remark", {
		url: "/remark",
		parent: "inventory_setup",
		views: {
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/remarkimage/InventorySetupRemarkImageView.html",
				controller: "InventorySetupRemarkImageController"
			}
		}
	}).state("inventory_settings", {
		url: "/settings",
		parent: "inventory_setup",
		views: {
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/settings/InventorySetupSettingsView.html",
				controller: "InventorySetupSettingsController"
			}
		}
	}).state("inventory_gl_accounts", {
		url: "/glaccounts",
		parent: "inventory_setup",
		views: {
			"inventory_setup_content@inventory_setup": {
				templateUrl: "modules/maintenance/inventory/glaccounts/InventorySetupGLAccountsView.html",
				controller: "InventorySetupGLAccountsController"
			}
		}
	}).state("currency_code_setup", {
		url: "/maintenance/currency_code/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/currency_code/CurrencyCodeSetupView.html",
				controller: "CurrencyCodeController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("remark_setup", {
		url: "/maintenance/remark/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/remark/RemarkSetupView.html",
				controller: "RemarkController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("customer_address_setup", {
		url: "/maintenance/customer_address/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/customer_address/CustomerAddressSetupView.html",
				controller: "CustomerAddressController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("salesperson_setup", {
		url: "/maintenance/salesperson/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/salesperson/SalespersonSetupView.html",
				controller: "SalespersonController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("paycode_setup", {
		url: "/maintenance/paycode/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/paycode/PaycodeSetupView.html",
				controller: "PaycodeController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("freight_setup", {
		url: "/maintenance/freight/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/freight/FreightSetupView.html",
				controller: "FreightController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("salestax_setup", {
		url: "/maintenance/salestax/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/salestax/SalextaxSetupView.html",
				controller: "SalestaxController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("revenuecode_setup", {
		url: "/maintenance/revenue_code/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/revenue_code/RevenueCodeSetupView.html",
				controller: "RevenueCodeController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("bankaccount_setup", {
		url: "/maintenance/bank_account/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/maintenance/bank_account/BankAccountSetupView.html",
				controller: "BankAccountController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("apply_payment", {
		url: "/transactions/apply_payment/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/account_receivable/apply_payment/ApplyPaymentSetupView.html",
				controller: "ApplyPaymentController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("ar_sales_return_with_invoice_setup", {
		url: "/ar/sales_return/with_invoice/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/account_receivable/sales_return/with_invoice/base/SalesReturnSetupView.html",
				controller: "SalesReturnWithInvoiceSetupController"
			},
			"sales_return_setup_content@ar_sales_return_with_invoice_setup": {
				templateUrl: "modules/account_receivable/sales_return/with_invoice/information/SalesReturnInformationView.html",
				controller: "SalesReturnWithInvoiceInformationController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("ar_sales_return_with_invoice_information", {
		url: "/information",
		parent: "ar_sales_return_with_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/with_invoice/information/SalesReturnInformationView.html",
				controller: "SalesReturnWithInvoiceInformationController"
			}
		}
	}).state("ar_sales_return_with_invoice_items", {
		url: "/line_items",
		parent: "ar_sales_return_with_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/with_invoice/lineitems/SalesReturnLineItemsView.html",
				controller: "SalesReturnWithInvoiceLineItemsController"
			}
		}
	}).state("ar_sales_return_with_invoice_payment", {
		url: "/payment",
		parent: "ar_sales_return_with_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/with_invoice/payment/SalesReturnPaymentView.html",
				controller: "SalesReturnWithInvoicePaymentController"
			}
		}
	}).state("ar_sales_return_with_invoice_notepad", {
		url: "/cnotepad",
		parent: "ar_sales_return_with_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/with_invoice/notepad/SalesReturnNotepadView.html",
				controller: "SalesReturnWithInvoiceNotepadController"
			}
		}
	}).state("ar_sales_return_with_invoice_preview", {
		url: "/preview",
		parent: "ar_sales_return_with_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/with_invoice/preview/SalesReturnPreviewView.html",
				controller: "SalesReturnWithInvoicePreviewController"
			}
		}
	}).state("ar_sales_return_without_invoice_setup", {
		url: "/ar/sales_return/without_invoice/setup",
		parent: "dashboard",
		views: {
			"dashboard_content": {
				templateUrl: "modules/account_receivable/sales_return/without_invoice/base/SalesReturnSetupView.html",
				controller: "SalesReturnWithoutInvoiceSetupController"
			},
			"sales_return_setup_content@ar_sales_return_without_invoice_setup": {
				templateUrl: "modules/account_receivable/sales_return/without_invoice/information/SalesReturnInformationView.html",
				controller: "SalesReturnWithoutInvoiceInformationController"
			}
		},
		resolve: {
			requireModuleAccess: ["ModuleAccess", function (ModuleAccess) {
				return ModuleAccess.verify("AR-XX", true);
			}]
		}
	}).state("ar_sales_return_without_invoice_information", {
		url: "/information",
		parent: "ar_sales_return_without_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/without_invoice/information/SalesReturnInformationView.html",
				controller: "SalesReturnWithoutInvoiceInformationController"
			}
		}
	}).state("ar_sales_return_without_invoice_items", {
		url: "/line_items",
		parent: "ar_sales_return_without_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/without_invoice/lineitems/SalesReturnLineItemsView.html",
				controller: "SalesReturnWithoutInvoiceLineItemsController"
			}
		}
	}).state("ar_sales_return_without_invoice_payment", {
		url: "/payment",
		parent: "ar_sales_return_without_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/without_invoice/payment/SalesReturnPaymentView.html",
				controller: "SalesReturnWithoutInvoicePaymentController"
			}
		}
	}).state("ar_sales_return_without_invoice_notepad", {
		url: "/cnotepad",
		parent: "ar_sales_return_without_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/without_invoice/notepad/SalesReturnNotepadView.html",
				controller: "SalesReturnWithoutInvoiceNotepadController"
			}
		}
	}).state("ar_sales_return_without_invoice_preview", {
		url: "/preview",
		parent: "ar_sales_return_without_invoice_setup",
		views: {
			"sales_return_setup_content": {
				templateUrl: "modules/account_receivable/sales_return/without_invoice/preview/SalesReturnPreviewView.html",
				controller: "SalesReturnWithoutInvoicePreviewController"
			}
		}
	});


}]);
app.directive('currency', function () {
	return {
		require: 'ngModel',
		link: function (elem, $scope, attrs, ngModel) {
			ngModel.$formatters.push(function (val) {
				if (val) {
					n = parseFloat(val).toFixed(2)
					return Number(n).toLocaleString('en');
				}
				else
					return '0.00'
			});
			ngModel.$parsers.push(function (val) {
				if (val) {
					n = parseFloat(val).toFixed(2)
					return Number(n).toLocaleString('en');
				}
				else
					return '0.00'
			});
		}
	}
})

app.run(["$rootScope", "$state", "$http", function ($rootScope, $state, $http) {
	//$rootScope.api_url = "http://litecodemexico.com/quaerp/web_api/api/";
	//$rootScope.api_url = "http://www.quaerp.dreamhosters.com/web_api/api/";
    $rootScope.api_url = "http://www.quaerp.com/web_api/api/";
	var system_in_prod = false;
	if (system_in_prod) {
		console.log = function () { };
		console.error = function () { };
	}

	$rootScope.$on('$stateChangeSuccess', function () {
		$("html, body").animate({
			scrollTop: 0
		}, 200);
	});
}]);

app.factory("UserSession", ["GenericFactory", "$rootScope", "$q", "$timeout", "$state", function (GenericFactory, $rootScope, $q, $timeout, $state) {
	var methods = {};

	methods.verify = function () {

		var q = $q.defer();
		var status = false;

		var token = localStorage.getItem("token");

		GenericFactory.get("validatetoken", token).then(function (response) {
			if (response.status) {
				$rootScope.logged_user = response.user;
				status = true;
				q.resolve();
			} else {
				swal({
					title: "Session invalida!",
					text: "Favor de iniciar session!",
					showConfirmButton: false,
					type: "error",
					timer: 3000
				});
				$timeout(function () {
					$state.go("login");
				});
				q.reject();
			}
		});

		return q.promise;

	};

	return methods;
}]);


// TODO: DELETE
app.factory("RequireCompany", ["$q", "$timeout", "$state", function ($q, $timeout, $state) {
	var methods = {};

	methods.check = function (company) {
		var q = $q.defer();

		var status = false;
		if (typeof (company) != "undefined") {
			if (company.id) {
				status = true;
				q.resolve();
			}
		}

		if (status == false) {
			swal({
				title: "No Company selected!",
				text: "Please select a company and try to access this module later.",
				type: "error"
			});
			$timeout(function () {
				$state.go("dashboard");
			});
			q.reject();
		}

		return q.promise;
	}

	return methods;
}]);

app.factory("ModuleAccess", ["$rootScope", "$q", "$timeout", "$interval", "$state", "GenericFactory", function ($rootScope, $q, $timeout, $interval, $state, GenericFactory) {

	var methods = {};

	methods.verify = function (module_code, company_needed = false) {

		var q = $q.defer();

		var continue_flow = false;
		if (company_needed) {
			try {
				if (typeof ($rootScope.syst_selected_company.id) != "undefined") {
					continue_flow = true;
				}
			} catch (e) { }
		} else {
			continue_flow = true;
		}

		if (continue_flow) {

			var selected_company = angular.copy($rootScope.syst_selected_company);

			var wait_interval = $interval(function () {

				if ($rootScope.logged_user) {
					$interval.cancel(wait_interval);

					var logged_user = angular.copy($rootScope.logged_user);

					if (logged_user.master == "1") {
						q.resolve();
					} else {

						GenericFactory.get("smuserhassmmodules").then(function (response) {
							if (response.status) {
								var status = false;

								var BreakException = {};
								try {
									response.results.forEach(function (result_row) {
										if (company_needed) {
											if (result_row.smmodules.code == module_code &&
												logged_user.id == result_row.smuser.id &&
												result_row.smcompany.id == selected_company.id) {
												status = true;
												throw BreakException;
											}
										} else {
											if (result_row.smmodules.code == module_code &&
												logged_user.id == result_row.smuser.id) {
												status = true;
												throw BreakException;
											}
										}
									});
								} catch (e) {
									if (e !== BreakException) {
										throw e;
									}
								}

								if (status) {
									q.resolve();
								} else {
									q.reject();
									swal({
										title: "Not allowed to be here!",
										text: "But.. if you need to, please contact administrator to access this module later.",
										type: "error"
									});
									$timeout(function () {
										$state.go("dashboard");
									});
								}

							} else {
								q.reject();
							}
						});

					}
				}
			});

		} else {
			q.reject();
			swal({
				title: "No Company selected!",
				text: "Please select a company and try to access this module later.",
				type: "error"
			});
			$timeout(function () {
				$state.go("dashboard");
			});
		}


		return q.promise;
	};

	return methods;
}]);

app.factory("CostaxFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.get = function () {
		var q = $q.defer();

		var api = $rootScope.api_url + "costax/";
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	return methods;
}]);

app.controller('DashboardController', ["$rootScope", "$scope", "$state", "GenericFactory", function ($rootScope, $scope, $state, GenericFactory) {
	// Browser title
	$rootScope.page_title = "Dashboard";

	$rootScope.syst_selected_company = {};
	$scope.syst_selected_module = {};

	$scope.syst_module_list = [
		{
			"code": "AR",
			"name": "Account Receivable"
		}
	];

	$scope.api_version_log = {};
	$scope.dashboard_version_log = {};
	/*GenericFactory.get("version").then(function (response) {
		if (response.status) {
			$scope.api_version_log = response.api;
			$scope.dashboard_version_log = response.dashboard;
		}
	});*/

	$scope.company_list = [];
	$scope.loadCompanyToSideBar = function () {
		GenericFactory.get("smcompany").then(function (response) {
			$scope.company_list = response.results;
		});
	};
	$scope.loadCompanyToSideBar();

	$scope.selectCompany = function (company) {
		$rootScope.syst_selected_company = company;
		$state.go("dashboard");
	};

	$scope.selectModule = function (module) {
		$scope.syst_selected_module = module;
	};

	$scope.showApiLog = function () {
		var message = `
            <div style='text-align: left'>
                <hr>
                <b>Description</b><br>
                {0}<br>
                <b>Date</b><br>
                {1}<br>
                <b>Author</b><br>
                {2}<br>
                <b>Repository commit</b><br>
                {3}<br>
            </div>`.format(
			$scope.api_version_log.description,
			$scope.api_version_log.date,
			$scope.api_version_log.author,
			$scope.api_version_log.commit
			);
		swal({
			title: "Last change in <u>API</u> repository",
			text: message,
			html: true
		});
	};

	$scope.showDashboardLog = function () {
		var message = `
            <div style='text-align: left'>
                <hr>
                <b>Description</b><br>
                {0}<br>
                <b>Date</b><br>
                {1}<br>
                <b>Author</b><br>
                {2}<br>
                <b>Repository commit</b><br>
                {3}<br>
            </div>`.format(
			$scope.dashboard_version_log.description,
			$scope.dashboard_version_log.date,
			$scope.dashboard_version_log.author,
			$scope.dashboard_version_log.commit
			);

		swal({
			title: "Last change in <u>DASHBOARD</u> repository",
			text: message,
			html: true
		});
	};


	// Plugins
	Breakpoints();
	Site.run();
}]);

app.factory("AuthModulesFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.get = function () {
		var q = $q.defer();

		var api = $rootScope.api_url + "authmodules/";
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	return methods;
}]);

app.controller('forbiddenController', ["$rootScope", function ($rootScope) {
	// Browser title
	$rootScope.page_title = "403 Forbidden";

}]);

app.controller('notFoundController', ["$rootScope", function ($rootScope) {
	// Browser title
	$rootScope.page_title = "404 Not found";

}]);

app.controller('GroupSetupController', ["$scope", "$rootScope", "GroupFactory", "$state", "AuthModulesFactory", "UserFactory", function ($scope, $rootScope, GroupFactory, $state, AuthModulesFactory, UserFactory) {
	// Browser title
	$rootScope.page_title = "Group Setup";

	$rootScope.syst_selected_company = { "id": "6", "cid": "inc", "name": "Qualfin INC", "address": "address1", "city": "city1", "state": "state1", "zip": "42315", "phone": "1234567890", "subdirectory": "subdirectory1", "nofp": "2", "df": "American", "hcurrency": "USD", "fdofd": "05\/20\/1994", "cfy": "2007", "sta": "USA", "db_hostname": "11.11.11.11", "db_port": "3306", "db_username": "erick", "db_password": "password", "db_schema": "inc_db", "created": "2017-02-01 12:47:25", "updated": null };


	// $scope.main_group_to_show = $scope.group_list[0];
	// $scope.selectGroupToShow = function(group_index) {
	//     $scope.main_group_to_show = $scope.group_list[group_index];
	//     console.log($scope.main_group_to_show);
	// };

	// $scope.user = {};
	// $scope.edit_user = {};
	// $scope.edit_group = {};
	// $scope.edit_group_list = {};

	// TESTING
	// $scope.user.name = "Erick";
	// $scope.user.username = "ealvarez";
	// $scope.user.password = "password";
	// $scope.user.selected_group = "0";

	// $scope.accessmodules_list = [];
	//
	// $scope.group_list = [];
	// $scope.group = {};

	// TESTING
	// $scope.group.name = "group1";
	// $scope.group.day_sun = true;
	// $scope.group.day_mon = false;
	// $scope.group.day_tue = true;
	// $scope.group.day_wed = false;
	// $scope.group.day_thu = true;
	// $scope.group.day_fri = false;
	// $scope.group.day_sat = true;
	// $scope.group.login_start = "12:00";
	// $scope.group.login_end = "18:00";

	// AuthModulesFactory.get().then(function(response) {
	//     if (response.status) {
	//         response.results.map(function (current, index) {
	//             response.results[index].selected = false;
	//         });
	//         // $scope.accessmodules_list = response.results;
	//         $scope.group.accessmodules = response.results;
	//     }
	// });

	// $scope.loadGroups = function() {
	//     // GroupFactory.get($scope.company_id).then(function (response) {
	//     GroupFactory.get($scope.company_id).then(function (response) {
	//         if (response.status) {
	//             $scope.group_list = response.results;
	//
	//             if ($scope.group_list[0].users.length > 0) {
	//                 $scope.main_group_to_show = $scope.group_list[0];
	//             }
	//         }
	//     });
	// }

	// $scope.loadGroups();


	// $scope.deleteUser = function(user_to_delete) {
	//     // console.log(user_to_delete);
	//
	//     swal({
	//         title: "Are you sure?",
	//         text: "You will not be able to recover this user!",
	//         type: "warning",
	//         showCancelButton: true,
	//         confirmButtonClass: "btn-danger",
	//         confirmButtonText: "Yes, delete it!",
	//         cancelButtonText: "No, cancel.",
	//         closeOnConfirm: false,
	//         closeOnCancel: false,
	//         timer: 4000
	//     }, function(isConfirm) {
	//         if (isConfirm) {
	//             UserFactory.delete(user_to_delete.id).then(function (response) {
	//                 if (response.status) {
	//                     swal("Deleted!", "The user has been deleted.", "success");
	//                     $scope.loadGroups();
	//                 } else {
	//                     console.error(response);
	//                     throw new Error("error al eliminar usuario..");
	//                 }
	//             });
	//         } else {
	//             swal("Cancelled", "Your user is safe", "error");
	//         }
	//     });
	// };

	// $scope.openAddUserModal = function() {
	//     $("#addUserModal").modal("show");
	// };

	// $scope.userRowClick = function (access_module) {
	//     if (access_module.status) {
	//         access_module.status = 0;
	//     } else {
	//         access_module.status = 1;
	//     }
	// };

	// $scope.submitAddUserModal = function() {
	//     var payload = {
	//         "name": $scope.user.name,
	//         "username": $scope.user.username,
	//         "password": $scope.user.password,
	//         "group_id": $scope.group_list[$scope.user.selected_group].id,
	//         "auth_modules": $scope.group_list[$scope.user.selected_group].modules
	//     };
	//
	//     // console.log(payload);
	//
	//     UserFactory.create(payload).then(function (response) {
	//         if (response.status) {
	//             $("#addUserModal").modal("hide");
	//             swal({
	//                 title: "Good job!",
	//                 text: "The user has been added successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//
	//             $scope.loadGroups();
	//
	//             $scope.user.name = "";
	//             $scope.user.username = "";
	//             $scope.user.password = "";
	//             $scope.user.selected_group = "0";
	//         } else {
	//             console.error(response);
	//             throw new Error("error al crear usuario..");
	//         }
	//     });
	//
	//     // console.log($scope.group_list);
	//
	//     // swal({
	//     //     title: "Good job!",
	//     //     text: "The user has been added successfully!",
	//     //     type: "success",
	//     //     timer: 2000
	//     // });
	//
	//     // $("#addUserModal").modal("hide");
	// };

	// $scope.openAddGroupModal = function() {
	//     $("#AddGroupModal").modal("show");
	// };
	//
	// $scope.submitAddGroup = function() {
	//     alert("asd");
	//
	//     var payload = {};
	//     payload = $scope.group;
	//     payload.company_id = $scope.company_id;
	//
	//     GroupFactory.create(payload).then(function (response) {
	//         if (response.status) {
	//             $("#addGroupModal").modal("hide");
	//             swal({
	//                 title: "Good job!",
	//                 text: "The group has been added successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//
	//             $scope.group.name = "";
	//             $scope.group.day_sun = false;
	//             $scope.group.day_mon = false;
	//             $scope.group.day_tue = false;
	//             $scope.group.day_wed = false;
	//             $scope.group.day_thu = false;
	//             $scope.group.day_fri = false;
	//             $scope.group.day_sat = false;
	//
	//             $scope.loadGroups();
	//         } else {
	//             console.error(response);
	//             throw new Error("error al crear grupo..");
	//         }
	//     });
	// };



	// $scope.editUser = function (user) {
	//     UserFactory.getOne(user.id).then(function (response) {
	//         if (response.status) {
	//             // console.log(response.results.name);
	//             $scope.edit_user.id = user.id;
	//             $scope.edit_user.name = response.results.name;
	//             $scope.edit_user.username = response.results.username;
	//             $scope.edit_user.password = response.results.password;
	//             $scope.edit_user.auth_modules = response.results.auth_modules;
	//
	//             $("#editUserModal").modal("show");
	//         }
	//     });
	// };

	// $scope.submitEditUserModal = function() {
	//     var payload = $scope.edit_user;
	//     var user_id = $scope.edit_user.id;
	//     UserFactory.update(user_id, payload).then(function (response) {
	//         if (response.status) {
	//             $("#editUserModal").modal("hide");
	//             swal({
	//                 title: "Good job!",
	//                 text: "The User has been updated successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//             $scope.loadGroups();
	//         } else {
	//             console.error(response);
	//             throw new Error("error al actualizar usuario..");
	//         }
	//     });
	// };


	// $scope.openEditGroupModal = function () {
	//     GroupFactory.get($scope.company_id).then(function (response) {
	//         if (response.status) {
	//             console.log(response.results);
	//             $scope.edit_group_list = response.results
	//             $("#editGroupModal").modal("show");
	//             //  $scope.edit_selected_group = 0;
	//         }
	//     });
	// };

	// $scope.submitEditGroup = function () {
	//     // console.log($scope.edit_selected_group);
	//     // console.log($scope.edit_group_list);
	//     var selected_group_index = $scope.edit_selected_group;
	//     console.log(selected_group_index);
	//     // console.log(selected_group_index);
	//     var payload = $scope.edit_group_list[selected_group_index];
	//     //
	//     console.log(payload);
	//     GroupFactory.update(payload.id, payload).then(function (response) {
	//         if (response.status) {
	//             $("#editGroupModal").modal("hide");
	//             swal({
	//                 title: "Good job!",
	//                 text: "The Group has been updated successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//             $scope.loadGroups();
	//         }
	//     });
	// };

	// $scope.changeActiveStateUser = function(selected_user) {
	//     // console.log(selected_user.id);
	//
	//     var user_id = selected_user.id;
	//     UserFactory.changeActiveState(user_id).then(function(response){
	//         console.log(response);
	//         if (response.status) {
	//             swal({
	//                 title: "Good job!",
	//                 text: "The User has been updated successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//             $scope.loadGroups();
	//         } else {
	//             console.error(response);
	//         }
	//     });
	// };

	// $scope.openDeleteGroupModal = function () {
	//     GroupFactory.get($scope.company_id).then(function (response) {
	//         if (response.status) {
	//             console.log(response.results);
	//             $scope.delete_group_list = response.results
	//             $("#deleteGroupModal").modal("show");
	//         }
	//     });
	// };

	// $scope.submitDeleteGroup = function () {
	//
	//     console.log(typeof($scope.delete_selected_group));
	//     console.log($scope.delete_selected_group);
	//     if (typeof($scope.delete_selected_group) != "undefined") {
	//         var current_group = $scope.delete_group_list[$scope.delete_selected_group];
	//
	//         if (current_group.users.length > 0) {
	//
	//             var alert_message = "The group that you are trying to delete still have {0} users!".format(
	//                 current_group.users.length
	//             );
	//             swal({
	//                 title: "Take it easy cowboy!",
	//                 text: alert_message,
	//                 type: "warning"
	//             });
	//         } else {
	//             GroupFactory.delete(current_group.id).then(function (response) {
	//                 if (response.status) {
	//                     swal({
	//                         title: "Good job!",
	//                         text: "The Group has been deleted successfully!",
	//                         type: "success",
	//                         timer: 2000
	//                     });
	//                     $("#deleteGroupModal").modal("hide");
	//                     $scope.loadGroups();
	//                 } else {
	//                     console.error(response);
	//                 }
	//             });
	//         }
	//     }
	//     // console.log($scope.delete_selected_group);
	//     // console.log($scope.delete_group_list);
	// };

	// plugins
	$('#login_start').formatter({
		'pattern': '{{99}}:{{99}}',
		'persistent': true
	});

	$('#login_end').formatter({
		'pattern': '{{99}}:{{99}}',
		'persistent': true
	});

}]);

app.factory("GlAccountsFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.get = function () {
		var q = $q.defer();

		var api = $rootScope.api_url + "glaccounts/";
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	return methods;
}]);

app.factory("ItemFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.get = function () {
		var q = $q.defer();

		var api = $rootScope.api_url + "item/";
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	return methods;
}]);

app.controller('LoginController', ["$scope", "$rootScope", "GenericFactory", "$state", function ($scope, $rootScope, GenericFactory, $state) {
	// Browser title
	$rootScope.page_title = "Login";

	$scope.show_login_message = false;
	$scope.login_error_message = "";

	localStorage.removeItem("token");

	$scope.user = {};

	// Default values (TESTING)
	$scope.user.username = "ealvarez";
	$scope.user.password = "password";


	$scope.submit = function () {

		var payload = {
			"username": $scope.user.username,
			"password": $scope.user.password
		};

		GenericFactory.post("login", payload).then(function (response) {

			if (response.status) {
				localStorage.setItem("token", response.token);
				swal({
					title: "Cool!",
					text: "Welcome to QUAERP Dashboard",
					type: "success",
					showConfirmButton: false,
					timer: 2500
				});
				$state.go("dashboard");
			} else {
				swal("Not cool!", "wrong credentials!", "error");
			}
		});

	};

}]);

app.factory("LoginFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.login = function (payload) {
		var q = $q.defer();

		var parameters = JSON.stringify(payload);
		var api = $rootScope.api_url + "login/";
		$http.post(
			api,
			parameters
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.verify = function () {
		var q = $q.defer();

		var web_token = localStorage.getItem("token");
		var api = $rootScope.api_url + "auth/" + web_token;
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	return methods;
}]);

app.factory("UserFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.create = function (payload) {
		var q = $q.defer();

		var parameters = JSON.stringify(payload);
		var api = $rootScope.api_url + "user/";
		$http.post(
			api,
			parameters
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.delete = function (user_id) {
		var q = $q.defer();

		// var parameters = JSON.stringify(payload);
		var api = $rootScope.api_url + "user/" + user_id;
		$http.delete(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.getOne = function (user_id) {
		var q = $q.defer();

		var api = $rootScope.api_url + "user/" + user_id;
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.update = function (user_id, payload) {
		var q = $q.defer();

		var api = $rootScope.api_url + "user/" + user_id;
		var parameters = JSON.stringify(payload);
		$http.put(
			api,
			parameters
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.changeActiveState = function (user_id) {
		var q = $q.defer();

		var api = $rootScope.api_url + "user/changestate/" + user_id;
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	}

	return methods;
}]);

app.factory("GenericFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.post = function (entity_name, payload, headers = "") {
		var q = $q.defer();

		// delete payload["$$hashKey"];
		var parameters = payload;
		var api = $rootScope.api_url + entity_name;
		$http.post(
			api,
			parameters,
			headers
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.get = function (entity_name, entity_id = "", headers = "") {
		var q = $q.defer();

		var api = $rootScope.api_url + entity_name + "/" + entity_id;

		$http.get(
			api,
			headers
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.put = function (entity_name, payload, headers = "") {
		var q = $q.defer();

		// delete payload["$$hashKey"];

		var api = $rootScope.api_url + entity_name;
		var parameters = payload;
		$http.put(
			api,
			parameters,
			headers
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.delete = function (entity_name, entity_id, headers = "") {
		var q = $q.defer();

		var api = $rootScope.api_url + entity_name + "/" + entity_id;
		$http.delete(
			api,
			headers
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	return methods;
}]);

app.controller('ApplyPaymentController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", "$timeout", function ($scope, $rootScope, $state, GenericFactory, Alertify, $timeout) {
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
		GenericFactory.get("arsyst", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.arsyst_config = response.results[0];
				console.log("system settings:");
				console.log($scope.arsyst_config);
			}
		});
	}
	loadSystemSettings();

	$scope.customer_list = [];
	GenericFactory.get("arcust", "", custom_headers).then(function (response) {
		if (response.status) {
			$scope.customer_list = response.results;
		}
	});

	$scope.paycode_list = [];
	GenericFactory.get("arpycd", "", custom_headers).then(function (response) {
		if (response.status) {
			$scope.paycode_list = response.results;
		}
	});

	$scope.bank_list = [];
	GenericFactory.get("cobank", "", custom_headers).then(function (response) {
		if (response.status) {
			$scope.bank_list = response.results;
		}
	});

	$scope.cash_list = [];

	function loadCashList() {
		GenericFactory.get("arcash", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.cash_list = response.results;
				calculateOpenCredit();
			}
		});
	}

	function calculateOpenCredit() {
		// cash.ccustno == payment_form.ccustno && (cash.npaidamt - cash.nappamt) != 0
		$scope.cash_list.forEach(function (cash) {
			if (cash.ccustno == $scope.payment_form.ccustno) {
				$scope.totals.open_credit += (cash.npaidamt - cash.nappamt);
			}
		});
	};

	$scope.calculateApplyOpenCredit = function () {
		$scope.totals.apply_open_credit = 0;
		$scope.cash_list.forEach(function (cash) {
			if (cash.ccustno == $scope.payment_form.ccustno && typeof (cash.apply_amount) != "undefined") {
				$scope.totals.apply_open_credit += Number(cash.apply_amount);
			}
		});
	};

	$scope.calculateApplyAmountTotal = function () {

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
		GenericFactory.get("arinvoice", query, custom_headers).then(function (response) {
			if (response.status) {

				for (var i = 0; i < response.results.length; i++) {
					var current_invoice = response.results[i];

					var balance = Number(current_invoice.nbalance);
					if (balance > 0) {
						var nsalesamt = current_invoice.nsalesamt;
						var ntotpaid = ((typeof (current_invoice.ntotpaid) == "undefined") ? 0 : current_invoice.ntotpaid);
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
		GenericFactory.get("arcard", query, custom_headers).then(function (response) {
			if (response.status) {
				$scope.card_list = response.results;
			} else {
				alertify.error("It looks like this customer does not have any cards");
			}
		});
	};

	$scope.openClientModal = function () {
		$("#SelectCustomerModal").modal("show");
	};

	$scope.selectCustomer = function (customer) {
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

	$scope.openCardModal = function () {
		$("#SelectCardModal").modal("show");
	};

	$scope.selectCard = function (card) {
		$("#SelectCardModal").modal("hide");
		$scope.payment_form.ccardno = card.ccardno;
	};

	$scope.openBankModal = function () {
		$("#SelectBankModal").modal("show");
	};

	$scope.selectBank = function (bank) {
		$("#SelectBankModal").modal("hide");
		// console.log(bank);
		$scope.payment_form.cbankno = bank.id;
	};

	$scope.openPaycodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (paycode) {
		$("#SelectPaycodeModal").modal("hide");

		$scope.payment_form.cpaycode = paycode.cpaycode;
	};

	$scope.openOpenCreditModal = function () {
		$("#OpenCreditModal").modal("show");
	};

	$scope.openApplyOpenCreditModal = function () {
		$("#ApplyOpenCreditModal").modal("show");
	};

	$scope.copyBalanceToApplyAmount = function (invoice) {
		var nsalesamt = invoice.nsalesamt;
		var ntotpaid = ((typeof (invoice.ntotpaid) == "undefined") ? 0 : invoice.ntotpaid);
		invoice.apply_amount = nsalesamt - ntotpaid;
	};

	$scope.copyBalanceToApplyAmountTotal = function () {
		$scope.totals.apply_ammount = $scope.totals.balance;
	};

	$scope.savePayment = function () {

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

		if ($scope.payment_form.cbankno == "" || typeof ($scope.payment_form.cbankno) == "undefined") {
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
				$scope.cash_list.forEach(function (cash) {
					if (cash.ccustno == $scope.payment_form.ccustno && typeof (cash.apply_amount) != "undefined") {
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
				GenericFactory.put("arsyst", arsyst_payload, custom_headers).then(function (response) {
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
			messages_list.forEach(function (message) {
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

	$scope.triggerTab = function (keyEvent, index) {

		if (keyEvent.which === 13) {
			var element_id = "#amount_total{0}".format(index);
			var current_element = angular.element(element_id);
			var next_element_id = "#amount_total{0}".format(index + 1);
			var next_element = angular.element(next_element_id);

			next_element.focus();
		}

	};

}]);

app.controller('CurrencyCodeController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Currency Code";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.currency = {};

	$scope.current_nlxchgrate = "";
	$scope.current_dlxchgrate = "";

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.currency_list = [];
	$scope.loadCurrencyList = function () {
		GenericFactory.get("cocurr", "", custom_headers).then(function (response) {
			$scope.currency_list = response.results;
		});
	};
	$scope.loadCurrencyList();

	$scope.saveCurrency = function () {
		GenericFactory.post("cocurr", $scope.currency, custom_headers).then(function (response) {
			if (response.status) {
				Alertify.success("Currency: {0} has been added successfully".format(
					$scope.currency.ccurrcode
				));

				$scope.clearCurrencyForm();
				$scope.loadCurrencyList();
			} else {
				Alertify.success("Error adding {0}".format(
					$scope.currency.ccurrcode
				));
			}
		});
	};

	$scope.clearCurrencyForm = function () {
		$scope.currency = {};
		$("#exchange_rate_date").val("");
		Alertify.log("Currency form has been cleaned successfully");
	};

	$scope.deleteCurrency = function () {
		var currency_id = $scope.currency.id;
		GenericFactory.delete("cocurr", currency_id, custom_headers).then(function (response) {
			if (response.status) {
				Alertify.success("Currency: {0} has been deleted successfully".format(
					$scope.currency.ccurrcode
				));

				$scope.clearCurrencyForm();
				$scope.loadCurrencyList();
			} else {
				Alertify.error("Error deleting {0}".format(
					$scope.currency.ccurrcode
				));
			}
		});
	};

	$scope.updateCurrency = function () {

		$scope.currency.dxchgrate = $("#exchange_rate_date").val();
		$scope.currency.nlxchgrate = $scope.current_nlxchgrate;
		$scope.currency.dlxchgrate = $scope.current_dlxchgrate;

		GenericFactory.put("cocurr", $scope.currency, custom_headers).then(function (response) {
			if (response.status) {
				Alertify.success("Currency: {0} has been updated successfully".format(
					$scope.currency.ccurrcode
				));

				$scope.clearCurrencyForm();
				$scope.loadCurrencyList();
			} else {
				Alertify.error("Error updating {0}".format(
					$scope.currency.ccurrcode
				));
			}
		});
	};

	$scope.openCurrencyCodeModal = function () {
		$("#selectCurrencyCodeModal").modal("show");
	};

	$scope.selectCurrencyCode = function (ccode) {
		$scope.currency = ccode;

		$scope.current_nlxchgrate = ccode.nxchgrate;
		$scope.current_dlxchgrate = ccode.dxchgrate;

		Alertify.log("Currency form has been loaded successfully");
		$("#selectCurrencyCodeModal").modal("hide");
	};

	new Formatter(document.getElementById('exchange_rate_date'), {
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});

	new Formatter(document.getElementById('last_exchange_rate_date'), {
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});

}]);

app.controller('CustomerAddressController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
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
	$scope.loadAddressList = function () {
		GenericFactory.get("arcadr", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.address_list = response.results;
			}
		});
	};
	$scope.loadAddressList();

	$scope.customer_list = [];
	$scope.loadClientList = function () {
		GenericFactory.get("arcust", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.customer_list = response.results;
			}
		});
	};
	$scope.loadClientList();

	$scope.invoice_list = [];
	$scope.loadInvoiceList = function () {
		GenericFactory.get("arinvoice", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.invoice_list = response.results;
			}
		});
	};
	$scope.loadInvoiceList();

	$scope.openClientModal = function () {
		$("#SelectCustomerModal").modal("show");
	};

	$scope.selectCustomer = function (customer) {
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

	$scope.openAddressModal = function () {
		$("#SelectAddressModal").modal("show");
	};

	$scope.selectAddress = function (address) {
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

	$scope.saveAddress = function () {
		var payload = angular.copy($scope.address);

		if (payload.ccompany && payload.caddrno && payload.caddr1) {

			var address_already_used = false;
			var cust_list = [];
			$scope.address_list.forEach(function (address) {

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
				GenericFactory.post("arcadr", payload, custom_headers).then(function (response) {
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

	$scope.deleteAddress = function () {

		var address_in_customer = false;
		var customer_name_list = [];
		$scope.customer_list.some(function (customer) {
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
			GenericFactory.delete("arcadr", $scope.address.id, custom_headers).then(function (response) {
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

	$scope.updateAddress = function () {
		var payload = angular.copy($scope.address);
		GenericFactory.put("arcadr", payload, custom_headers).then(function (response) {
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

	$scope.clearAddressForm = function () {
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



//----------------------------------------------------------------------------------------


//----------------------------------------------------------------------------------------

app.controller('FreightController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Freight";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.freight = {};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.freight_list = [];
	$scope.loadFreightList = function () {
		GenericFactory.get("arfrgt", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.freight_list = response.results;
			}
		});
	};
	$scope.loadFreightList();

	$scope.syst_config = {};
	$scope.loadSystConfig = function () {
		GenericFactory.get("arsyst", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.syst_config = response.results[0];
			}
		});
	};
	$scope.loadSystConfig();

	$scope.openFreightModal = function () {
		$("#SelectFreightModal").modal("show");
	};

	$scope.selectFreight = function (selected_freight) {
		$scope.freight = angular.copy(selected_freight);

		$("#SelectFreightModal").modal("hide");
	};

	$scope.saveFreight = function () {
		var payload = angular.copy($scope.freight);

		if (payload.description && payload.trevacc) {
			GenericFactory.post("arfrgt", payload, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadFreightList();
					$scope.freight = {};
					swal({
						title: "Success!",
						text: "You have added a new freight",
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
		} else {
			swal({
				title: "Error!",
				text: "Please, at least fill the freight NO & description",
				type: "error"
			});
		}

	};

	$scope.deleteFreight = function () {

		var freight_in_syst_config = false;
		if ($scope.syst_config.arfrgt.id == $scope.freight.id) {
			freight_in_syst_config = true;
		}

		if (freight_in_syst_config) {
			var message = "";

			message = "The selected freight is already been used in the system confguration";

			swal({
				title: "Hold on cowboy!",
				text: message,
				type: "warning"
			});
		} else {
			GenericFactory.delete("arfrgt", $scope.freight.id, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadFreightList();
					$scope.freight = {};
					swal({
						title: "Success!",
						text: "You have deleted the freight",
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

	$scope.updateFreight = function () {
		var payload = angular.copy($scope.freight);
		GenericFactory.put("arfrgt", payload, custom_headers).then(function (response) {
			if (response.status) {
				$scope.loadFreightList();
				$scope.freight = {};
				swal({
					title: "Success!",
					text: "You have updated the freight",
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

	$scope.clearFreightForm = function () {
		$scope.freight = {};
		Alertify.log("Freight form has been cleaned successfully");
	};

}]);

app.controller('RevenueCodeController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Revenue Code";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.revenue_code = {};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.$watch("revenue_code", function () {
		if ($scope.glaccount_list) {

			var inputs_to_check = ["crevnacc", "crtrnacc", "cdiscacc", "ccogsacc"];
			for (var i = 0; i < $scope.glaccount_list.length; i++) {
				var account = $scope.glaccount_list[i];
				var status = 0;

				inputs_to_check.forEach(function (input_code) {
					if ($scope.revenue_code[input_code] == account.id) {
						$scope[input_code] = account.description;
						status += 1;
					}
				});

				if (status == 4) {
					break;
				}

			}
		}
	}, 1);

	$scope.revenue_code_list = [];
	$scope.loadRevenueCodeList = function () {
		GenericFactory.get("arrevn", "limit/-1", custom_headers).then(function (response) {
			if (response.status) {
				$scope.revenue_code_list = response.results;
			}
		});
	};
	$scope.loadRevenueCodeList();

	$scope.glaccount_list = [];
	$scope.loadGLAccountList = function () {
		GenericFactory.get("glaccounts", "limit/-1", custom_headers).then(function (response) {
			if (response.status) {
				$scope.glaccount_list = response.results;
			}
		});
	};
	$scope.loadGLAccountList();

	$scope.openRevenueCodeModal = function () {
		$("#SelectRevenueCodeModal").modal("show");
	};

	$scope.selectRevenueCode = function (selected_revenue_code) {
		$scope.revenue_code = angular.copy(selected_revenue_code);

		$("#SelectRevenueCodeModal").modal("hide");
	};

	// glacc_input_to_work_with = glaitww
	var glaitww = 0;
	$scope.openGLAccountsModal = function (selected_input) {
		// console.log(selected_input);
		glaitww = selected_input;

		$("#SelectGLAccountModal").modal("show");
	};

	$scope.selectGLAccount = function (selected_gl_account) {

		switch (glaitww) {
			case 0:
				$scope.revenue_code.crevnacc = selected_gl_account.id;
				break;
			case 1:
				$scope.revenue_code.crtrnacc = selected_gl_account.id;
				break;
			case 2:
				$scope.revenue_code.cdiscacc = selected_gl_account.id;
				break;
			case 3:
				$scope.revenue_code.ccogsacc = selected_gl_account.id;
				break;
		}

		$("#SelectGLAccountModal").modal("hide");
	};

	$scope.saveRevenueCode = function () {
		var revenue_code_payload = angular.copy($scope.revenue_code);

		if (revenue_code_payload.crevncode && revenue_code_payload.cdescript) {

			GenericFactory.post("arrevn", revenue_code_payload, custom_headers).then(function (response) {
				if (response.status) {
					$scope.revenue_code = {};
					$scope.crevnacc = "";
					$scope.crtrnacc = "";
					$scope.cdiscacc = "";
					$scope.ccogsacc = "";

					$scope.loadRevenueCodeList();
					swal({
						title: "Success!",
						text: "You have added a new Revenue Code",
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

		} else {
			swal({
				title: "Error!",
				text: "Please, at least fill the Code & Description fields",
				type: "error"
			});
		}

	};

	$scope.deleteRevenueCode = function () {

		GenericFactory.delete("arrevn", $scope.revenue_code.id, custom_headers).then(function (response) {
			if (response.status) {
				$scope.revenue_code = {};
				$scope.crevnacc = "";
				$scope.crtrnacc = "";
				$scope.cdiscacc = "";
				$scope.ccogsacc = "";

				$scope.loadRevenueCodeList();
				swal({
					title: "Success!",
					text: "You have deleted the revenue code",
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

	$scope.updateRevenueCode = function () {
		var revenue_code_payload = angular.copy($scope.revenue_code);
		GenericFactory.put("arrevn", revenue_code_payload, custom_headers).then(function (response) {
			if (response.status) {
				$scope.revenue_code = {};
				$scope.crevnacc = "";
				$scope.crtrnacc = "";
				$scope.cdiscacc = "";
				$scope.ccogsacc = "";

				$scope.loadRevenueCodeList();
				swal({
					title: "Success!",
					text: "You have updated the revenue code",
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

	$scope.clearRevenueCodeForm = function () {
		$scope.revenue_code = {};
		$scope.crevnacc = "";
		$scope.crtrnacc = "";
		$scope.cdiscacc = "";
		$scope.ccogsacc = "";

		Alertify.log("Revenue Code form has been cleaned successfully");
	};

}]);

app.controller('RemarkController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Remark";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.remark = {};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.remark_list = [];
	$scope.loadRemarkList = function () {
		GenericFactory.get("arirmk", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.remark_list = response.results;
			}
		});
	};
	$scope.loadRemarkList();

	$scope.invoice_list = [];
	$scope.loadInvoiceList = function () {
		GenericFactory.get("arinvoice", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.invoice_list = response.results;
			}
		});
	};
	$scope.loadInvoiceList();

	$scope.openRemarkModal = function () {
		$("#SelectRemarkModal").modal("show");
	};

	$scope.selectRemark = function (remark) {
		$scope.remark = angular.copy(remark);
		$("#SelectRemarkModal").modal("hide");
	};

	$scope.saveRemark = function () {
		var payload = angular.copy($scope.remark);

		if (payload.code && payload.remarks) {
			GenericFactory.post("arirmk", payload, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadRemarkList();
					$scope.remark = {};
					swal({
						title: "Success!",
						text: "You have added a new Remark",
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
		} else {
			swal({
				title: "Error!",
				text: "Please, fill the form.",
				type: "error"
			});
		}

	};

	$scope.deleteRemark = function () {

		var remark_in_invoice = false;
		var invoice_id_list = [];
		$scope.invoice_list.some(function (invoice) {
			if (invoice.remark == $scope.remark.code) {
				remark_in_invoice = true;
				invoice_id_list.push(invoice.cinvno);
				// return 1;
			}
		});

		if (remark_in_invoice) {
			// console.log(invoice_id_list);
			// console.log(invoice_id_list.length);
			var message = "";
			if (invoice_id_list.length == 1) {
				message = "The selected remark is already been used in the following invoice: {0}".format(invoice_id_list);
			} else {
				message = "The selected remark is already been used in the following invoices: {0}".format(invoice_id_list);
			}
			// console.log(message);
			swal({
				title: "Hold on cowboy!",
				text: message,
				type: "warning"
			});
		} else {
			GenericFactory.delete("arirmk", $scope.remark.id, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadRemarkList();
					$scope.remark = {};
					swal({
						title: "Success!",
						text: "You have deleted the remark",
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

	$scope.updateRemark = function () {
		var payload = angular.copy($scope.remark);
		GenericFactory.put("arirmk", payload, custom_headers).then(function (response) {
			if (response.status) {
				$scope.loadRemarkList();
				$scope.remark = {};
				swal({
					title: "Success!",
					text: "You have updated the remark",
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

	$scope.clearRemarkForm = function () {
		$scope.remark = {};
		Alertify.log("Remark form has been cleaned successfully");
	};


}]);

app.controller('SalespersonController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Salesperson";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.salesperson = {};
	$scope.salesperson_status_list = [
		{
			"status": "A",
			"description": "Active"
		},
		{
			"status": "I",
			"description": "Inactive"
		}
	];

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.salesperson_list = [];
	$scope.loadSalespersonList = function () {
		GenericFactory.get("arslpn", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.salesperson_list = response.results;
			}
		});
	};
	$scope.loadSalespersonList();

	$scope.revenue_list = [];
	$scope.loadRevenueList = function () {
		GenericFactory.get("arrevn", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.revenue_list = response.results;
			}
		});
	};
	$scope.loadRevenueList();

	$scope.invoice_list = [];
	$scope.loadInvoiceList = function () {
		GenericFactory.get("arinvoice", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.invoice_list = response.results;
			}
		});
	};
	$scope.loadInvoiceList();

	$scope.openSalespersonModal = function () {
		$("#SelectSalespersonModal").modal("show");
	};

	$scope.selectSalesperson = function (salesperson) {
		$scope.salesperson = angular.copy(salesperson);

		$("#SelectSalespersonModal").modal("hide");
	};

	$scope.openRevenueModal = function () {
		$("#SelectRevenueModal").modal("show");
	};

	$scope.selectRevenue = function (revenue) {
		$scope.salesperson.crevncode = revenue.crevncode;
		$("#SelectRevenueModal").modal("hide");
	};

	$scope.saveSalesperson = function () {
		var payload = angular.copy($scope.salesperson);

		// console.log(payload);
		if (payload.cslpnno && payload.cname && payload.ctitle) {
			GenericFactory.post("arslpn", payload, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadSalespersonList();
					$scope.salesperson = {};
					swal({
						title: "Success!",
						text: "You have added a new Salesperson",
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
		} else {
			swal({
				title: "Error!",
				text: "Please, at least fill the NO, Name & Title fields",
				type: "error"
			});
		}

	};

	$scope.deleteSalesperson = function () {

		var salesperson_in_invoice = false;
		var invoice_name_list = [];
		$scope.invoice_list.some(function (invoice) {
			if (invoice.cslpnno == $scope.salesperson.cslpnno) {
				salesperson_in_invoice = true;
				invoice_name_list.push(invoice.cinvno);
				// return 1;
			}
		});

		// console.log(address_in_salesperson);
		// console.log(invoice_name_list);
		// throw new Error();

		if (salesperson_in_invoice) {
			// console.log(invoice_id_list);
			// console.log(invoice_id_list.length);
			var message = "";
			if (invoice_name_list.length == 1) {
				message = "The selected salesperson is already been used in the following invoice: {0}".format(invoice_name_list);
			} else {
				message = "The selected salesperson is already been used in the following invoices: {0}".format(invoice_name_list);
			}
			// console.log(message);
			swal({
				title: "Hold on cowboy!",
				text: message,
				type: "warning"
			});
		} else {
			GenericFactory.delete("arslpn", $scope.salesperson.id, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadSalespersonList();
					$scope.salesperson = {};
					swal({
						title: "Success!",
						text: "You have deleted the salesperson",
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

	$scope.updateSalesperson = function () {
		var payload = angular.copy($scope.salesperson);
		GenericFactory.put("arslpn", payload, custom_headers).then(function (response) {
			if (response.status) {
				$scope.loadSalespersonList();
				$scope.salesperson = {};
				swal({
					title: "Success!",
					text: "You have updated the salesperson",
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

	$scope.clearSalespersonForm = function () {
		$scope.salesperson = {};
		Alertify.log("Salesperson form has been cleaned successfully");
	};

}]);

app.controller('SalestaxController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Salex tax";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.salestax = {};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.salestax_list = [];
	$scope.loadSalestaxList = function () {
		GenericFactory.get("costax", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.salestax_list = response.results;
			}
		});
	};
	$scope.loadSalestaxList();

	$scope.currency_list = [];
	$scope.loadCurrencyList = function () {
		GenericFactory.get("cocurr", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.currency_list = response.results;
			}
		});
	};
	$scope.loadCurrencyList();

	$scope.tax_account_list = [];
	$scope.loadTaxAccountList = function () {
		GenericFactory.get("artaxacc", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.tax_account_list = response.results;
			}
		});
	};
	$scope.loadTaxAccountList();

	$scope.syst_config = {};
	$scope.loadSystConfig = function () {
		GenericFactory.get("arsyst", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.syst_config = response.results[0];
			}
		});
	};
	$scope.loadSystConfig();

	$scope.openSalestaxModal = function () {
		$("#SelectSalestaxModal").modal("show");
	};

	$scope.selectSalestax = function (selected_salestax) {
		$scope.salestax = angular.copy(selected_salestax);

		$("#SelectSalestaxModal").modal("hide");
	};

	$scope.openCurrencyModal = function () {
		$("#SelectCurrencyModal").modal("show");
	};

	$scope.selectCurrency = function (selected_currency) {
		$scope.salestax.currency = selected_currency.ccurrcode;

		$("#SelectCurrencyModal").modal("hide");
	};

	$scope.openTaxAccountModal = function () {
		$("#SelectTaxAccountModal").modal("show");
	};

	$scope.selectTaxAccount = function (selected_tax_account) {
		$scope.salestax.cstaxacc1 = selected_tax_account.id;
		$("#SelectTaxAccountModal").modal("hide");
	};

	$scope.saveSalestax = function () {
		var payload = angular.copy($scope.salestax);

		if (payload.ctaxcode && payload.cdescript && payload.ntaxrate1) {
			GenericFactory.post("costax", payload, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadSalestaxList();
					$scope.salestax = {};
					swal({
						title: "Success!",
						text: "You have added a new salestax",
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
		} else {
			swal({
				title: "Error!",
				text: "Please, at least fill the tax code, description & entity1 fields",
				type: "error"
			});
		}

	};

	$scope.deleteSalestax = function () {

		GenericFactory.delete("costax", $scope.salestax.id, custom_headers).then(function (response) {
			if (response.status) {
				$scope.loadSalestaxList();
				$scope.salestax = {};
				swal({
					title: "Success!",
					text: "You have deleted the salestax",
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

	$scope.updateSalestax = function () {
		var payload = angular.copy($scope.salestax);
		GenericFactory.put("costax", payload, custom_headers).then(function (response) {
			if (response.status) {
				$scope.loadSalestaxList();
				$scope.salestax = {};
				swal({
					title: "Success!",
					text: "You have updated the salestax",
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

	$scope.clearSalestaxForm = function () {
		$scope.salestax = {};
		Alertify.log("Salestax form has been cleaned successfully");
	};

}]);

app.controller('GroupSetupController', ["$scope", "$rootScope", "GenericFactory", "$state", "$q", function ($scope, $rootScope, GenericFactory, $state, $q) {
	// Browser title
	$rootScope.page_title = "Group Setup";

	// $rootScope.syst_selected_company = {"id":"6","cid":"inc","name":"Qualfin INC","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05\/20\/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"inc_db","created":"2017-02-01 12:47:25","updated":null};

	$scope.smmodules_list = [];
	$scope.loadModules = function () {
		GenericFactory.get("smmodules").then(function (response) {
			if (response.status) {
				$scope.smmodules_list = response.results;
			}
		});
	};
	$scope.loadModules();

	$scope.selected_smusergroup = {};
	$scope.smusergroup_list = [];
	$scope.loadUserGroups = function () {
		GenericFactory.get("smusergroup").then(function (response) {
			if (response.status) {
				$scope.smusergroup_list = response.results;

				GenericFactory.get("smusergrouphassmuser").then(function (response) {
					// console.log(response);
					if (response.status) {
						$scope.smusergroup_list.forEach(function (group) {
							group.user_list = [];
							response.results.forEach(function (row) {
								if (group.id == row.smusergroup.id) {
									group.user_list.push(row.smuser);
								}
							});
						});
					}
				});
			}
		});
	};
	$scope.loadUserGroups();

	// $scope.main_group_to_show = $scope.group_list[0];
	$scope.user_list_to_show = [];
	// $scope.selected_group = {};
	$scope.selected_smusergroup = {};
	$scope.selectGroupToShow = function (selected_group) {
		$scope.selected_smusergroup = selected_group;
		// console.log($scope.selected_smusergroup);
		if (selected_group.user_list.length > 0) {
			$scope.user_list_to_show = selected_group.user_list;
		} else {
			swal("Oops!!", "There is no users in this group.", "warning");
			$scope.user_list_to_show = [];
		}
	};

	$scope.blockUser = function (user) {
		var payload = {};
		payload.id = user.id;
		payload.active = !(user.active == "1");
		GenericFactory.put("smuser", payload).then(function (response) {
			user.active = payload.active;
			alertify.success("User have succesfully been updated");
		});
	};

	$scope.rowClick = function (module) {
		if (typeof (module.selected) == "undefined") {
			module.selected = true;
		} else {
			if (module.selected) {
				module.selected = false;
			} else {
				module.selected = true;
			}
		}
	};

	$scope.selected_company_edit_form = {};
	$scope.selectCompanyEditUser = function (company) {
		$scope.selected_company_edit_form = company;
		console.log($scope.selected_company_edit_form);
	};

	$scope.user_edit_form = {};
	$scope.initEditUserData = function () {
		// console.log($scope.selected_smusergroup);
		$scope.user_edit_form.group_name = $scope.selected_smusergroup.name;

		$scope.user_edit_form.company_list = [];
		$scope.user_edit_form.company_list = angular.copy($scope.company_list);
		$scope.user_edit_form.company_list.forEach(function (company, index) {
			$scope.user_edit_form.company_list[index].modules = [];
			$scope.user_edit_form.company_list[index].modules = angular.copy($scope.smmodules_list);
		});

		// $scope.selected_company = {};

		GenericFactory.get("smuserhassmmodules").then(function (response) {
			if (response.status) {

				response.results.forEach(function (row) {
					$scope.user_edit_form.company_list.forEach(function (company) {
						// console.log(row);
						// console.log(company.id + " " + row.smcompany.id + "/" + $scope.selected_smusergroup.id + " " + row.smusergroup.id);
						if (company.id == row.smcompany.id &&
							$scope.selected_smusergroup.id == row.smusergroup.id &&
							$scope.user_edit_form.id == row.smuser.id) {

							company.modules.forEach(function (module) {
								if (!module.selected) {
									if (row.smmodules.id == module.id) {
										module.selected = true;
									} else {
										module.selected = false;
									}
								}
							});
						}
					});
				});

			}
		});

	};

	$scope.submitEditUser = function () {

		var user_payload = angular.copy($scope.user_edit_form);
		var modules_payload = angular.copy(user_payload.company_list);

		delete user_payload.group_name;
		delete user_payload.company_list;
		delete user_payload.usergroup_list;
		delete user_payload.selected_group;

		GenericFactory.put("smuser", user_payload).then(function (response) {
			if (response.status) {

				let delete_prom_list = [];
				GenericFactory.get("smuserhassmmodules").then(function (userhasmodules) {
					if (userhasmodules.status) {
						userhasmodules.results.forEach(function (row) {
							if (row.smuser.id == user_payload.id) {
								delete_prom_list.push(GenericFactory.delete("smuserhassmmodules", row.smuser.id));
							}
						})
					}
					// console.log(userhasmodules);
				});

				$q.all(delete_prom_list).then(function (response) {

					let post_module_prom_list = [];
					modules_payload.forEach(function (company) {
						company.modules.forEach(function (module) {
							if (module.selected) {

								let payload = {};
								payload.smusergroup = {};
								payload.smusergroup.id = $scope.selected_smusergroup.id;
								payload.smcompany = {};
								payload.smcompany.id = company.id;
								payload.smmodules = {};
								payload.smmodules.id = module.id;
								payload.smuser = {};
								payload.smuser.id = user_payload.id;

								post_module_prom_list.push(GenericFactory.post("smuserhassmmodules", payload));
							}
						});
					});

					$q.all(post_module_prom_list).then(function (response) {

						$scope.user_edit_form.company_list = [];
						$scope.selected_company_edit_form.modules = [];
						$scope.user_edit_form = {};

						$("#EditUserModal").modal("hide");

						swal({
							title: "Success!",
							text: "User edited successfully",
							type: "success"
						});
					});

				});


			} else {
				swal("Cancelled", "Unespected error, contact admin", "error");
				console.error("-------->");
				console.error(response);
				console.error("-------->");
			}
		});

	};

	$scope.openEditUserModal = function (user) {
		$("#EditUserModal").modal("show");
		$scope.user_edit_form = user;
		$scope.initEditUserData();
	};

	$scope.deleteUser = function (user) {
		$scope.user_list_to_show.forEach(function (current_user, index) {
			if (user.id == current_user.id) {
				$scope.user_list_to_show.splice(index, 1);

				let prom_list = [];
				GenericFactory.get("smusergrouphassmuser").then(function (response) {
					if (response.status) {
						response.results.forEach(function (row) {
							if (row.smuser.id == user.id) {
								prom_list.push(GenericFactory.delete("smusergrouphassmuser", row.id));
							}
						});
					}
				});

				GenericFactory.get("smuserhassmmodules").then(function (response) {
					if (response.status) {
						response.results.forEach(function (row) {
							if (row.smuser.id == user.id) {
								prom_list.push(GenericFactory.delete("smuserhassmmodules", row.id));
							}
						});
					}
				});

				$q.all(prom_list).then(function (response) {
					GenericFactory.delete("smuser", user.id).then(function (response) {
						if (response.status) {
							alertify.success("User deleted");
						} else {
							alertify.error("User deleted");
						}
					});
				});

			}
		});
	};


	// $scope.user = {};
	// $scope.edit_user = {};
	// $scope.edit_group = {};
	// $scope.edit_group_list = {};

	// TESTING
	// $scope.user.name = "Erick";
	// $scope.user.username = "ealvarez";
	// $scope.user.password = "password";
	// $scope.user.selected_group = "0";

	// $scope.accessmodules_list = [];
	//
	// $scope.group_list = [];
	// $scope.group = {};

	// TESTING
	// $scope.group.name = "group1";
	// $scope.group.day_sun = true;
	// $scope.group.day_mon = false;
	// $scope.group.day_tue = true;
	// $scope.group.day_wed = false;
	// $scope.group.day_thu = true;
	// $scope.group.day_fri = false;
	// $scope.group.day_sat = true;
	// $scope.group.login_start = "12:00";
	// $scope.group.login_end = "18:00";

	// AuthModulesFactory.get().then(function(response) {
	//     if (response.status) {
	//         response.results.map(function (current, index) {
	//             response.results[index].selected = false;
	//         });
	//         // $scope.accessmodules_list = response.results;
	//         $scope.group.accessmodules = response.results;
	//     }
	// });

	// $scope.loadGroups = function() {
	//     // GenericFactory.get($scope.company_id).then(function (response) {
	//     GenericFactory.get($scope.company_id).then(function (response) {
	//         if (response.status) {
	//             $scope.group_list = response.results;
	//
	//             if ($scope.group_list[0].users.length > 0) {
	//                 $scope.main_group_to_show = $scope.group_list[0];
	//             }
	//         }
	//     });
	// }

	// $scope.loadGroups();


	// $scope.deleteUser = function(user_to_delete) {
	//     // console.log(user_to_delete);
	//
	//     swal({
	//         title: "Are you sure?",
	//         text: "You will not be able to recover this user!",
	//         type: "warning",
	//         showCancelButton: true,
	//         confirmButtonClass: "btn-danger",
	//         confirmButtonText: "Yes, delete it!",
	//         cancelButtonText: "No, cancel.",
	//         closeOnConfirm: false,
	//         closeOnCancel: false,
	//         timer: 4000
	//     }, function(isConfirm) {
	//         if (isConfirm) {
	//             UserFactory.delete(user_to_delete.id).then(function (response) {
	//                 if (response.status) {
	//                     swal("Deleted!", "The user has been deleted.", "success");
	//                     $scope.loadGroups();
	//                 } else {
	//                     console.error(response);
	//                     throw new Error("error al eliminar usuario..");
	//                 }
	//             });
	//         } else {
	//             swal("Cancelled", "Your user is safe", "error");
	//         }
	//     });
	// };

	// $scope.openAddUserModal = function() {
	//     $("#addUserModal").modal("show");
	// };

	// $scope.userRowClick = function (access_module) {
	//     if (access_module.status) {
	//         access_module.status = 0;
	//     } else {
	//         access_module.status = 1;
	//     }
	// };

	// $scope.submitAddUserModal = function() {
	//     var payload = {
	//         "name": $scope.user.name,
	//         "username": $scope.user.username,
	//         "password": $scope.user.password,
	//         "group_id": $scope.group_list[$scope.user.selected_group].id,
	//         "auth_modules": $scope.group_list[$scope.user.selected_group].modules
	//     };
	//
	//     // console.log(payload);
	//
	//     UserFactory.create(payload).then(function (response) {
	//         if (response.status) {
	//             $("#addUserModal").modal("hide");
	//             swal({
	//                 title: "Good job!",
	//                 text: "The user has been added successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//
	//             $scope.loadGroups();
	//
	//             $scope.user.name = "";
	//             $scope.user.username = "";
	//             $scope.user.password = "";
	//             $scope.user.selected_group = "0";
	//         } else {
	//             console.error(response);
	//             throw new Error("error al crear usuario..");
	//         }
	//     });
	//
	//     // console.log($scope.group_list);
	//
	//     // swal({
	//     //     title: "Good job!",
	//     //     text: "The user has been added successfully!",
	//     //     type: "success",
	//     //     timer: 2000
	//     // });
	//
	//     // $("#addUserModal").modal("hide");
	// };

	$scope.initCreateUserGroupData = function () {
		$scope.usergroup_add_form = {};

		$scope.usergroup_add_form.company_list = [];
		$scope.usergroup_add_form.company_list = angular.copy($scope.company_list);

		$scope.usergroup_add_form.company_list.forEach(function (company, index) {
			$scope.usergroup_add_form.company_list[index].modules = {};
			$scope.usergroup_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
		});
		// console.log($scope.usergroup_add_form);
	};

	$scope.openCreateGroupModal = function () {
		$("#CreateUserGroupModal").modal("show");
		$scope.initCreateUserGroupData();
	};

	$scope.usergroup_delete_form = {};
	$scope.initDeleteUserGroupData = function () {
		$scope.usergroup_delete_form.smusergroup_list = [];
		$scope.usergroup_delete_form.smusergroup_list = $scope.smusergroup_list;
	};

	$scope.openDeleteGroupModal = function () {
		$("#DeleteUserGroupModal").modal("show");
		$scope.initDeleteUserGroupData();
	};

	// $scope.editUser = function (user) {
	//     UserFactory.getOne(user.id).then(function (response) {
	//         if (response.status) {
	//             // console.log(response.results.name);
	//             $scope.edit_user.id = user.id;
	//             $scope.edit_user.name = response.results.name;
	//             $scope.edit_user.username = response.results.username;
	//             $scope.edit_user.password = response.results.password;
	//             $scope.edit_user.auth_modules = response.results.auth_modules;
	//
	//             $("#editUserModal").modal("show");
	//         }
	//     });
	// };

	// $scope.submitEditUserModal = function() {
	//     var payload = $scope.edit_user;
	//     var user_id = $scope.edit_user.id;
	//     UserFactory.update(user_id, payload).then(function (response) {
	//         if (response.status) {
	//             $("#editUserModal").modal("hide");
	//             swal({
	//                 title: "Good job!",
	//                 text: "The User has been updated successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//             $scope.loadGroups();
	//         } else {
	//             console.error(response);
	//             throw new Error("error al actualizar usuario..");
	//         }
	//     });
	// };

	$scope.initCreateUserData = function () {

		$scope.user_add_form = {};
		$scope.user_add_form.name = "ea";
		$scope.user_add_form.username = "eauser";
		$scope.user_add_form.password = "password";
		// $scope.user_add_form.company_list = [];
		// $scope.user_add_form.company_list = angular.copy($scope.company_list);
		$scope.user_add_form.usergroup_list = [];
		$scope.user_add_form.usergroup_list = angular.copy($scope.smusergroup_list);
		// console.log($scope.user_add_form.usergroup_list);

		// $scope.user_add_form.company_list.forEach(function(company, index) {
		//     $scope.user_add_form.company_list[index].modules = {};
		//     $scope.user_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
		// });
	};

	$scope.openCreateUserModal = function () {
		$("#CreateUserModal").modal("show");
		$scope.initCreateUserData();
	};

	$scope.openEditGroupModal = function () {
		$("#EditUserGroupModal").modal("show");
		// GenericFactory.get($scope.company_id).then(function (response) {
		//     if (response.status) {
		//         console.log(response.results);
		//         $scope.edit_group_list = response.results
		//         //  $scope.edit_selected_group = 0;
		//     }
		// });
	};

	// $scope.submitEditGroup = function () {
	//     // console.log($scope.edit_selected_group);
	//     // console.log($scope.edit_group_list);
	//     var selected_group_index = $scope.edit_selected_group;
	//     console.log(selected_group_index);
	//     // console.log(selected_group_index);
	//     var payload = $scope.edit_group_list[selected_group_index];
	//     //
	//     console.log(payload);
	//     GenericFactory.update(payload.id, payload).then(function (response) {
	//         if (response.status) {
	//             $("#editGroupModal").modal("hide");
	//             swal({
	//                 title: "Good job!",
	//                 text: "The Group has been updated successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//             $scope.loadGroups();
	//         }
	//     });
	// };

	// $scope.changeActiveStateUser = function(selected_user) {
	//     // console.log(selected_user.id);
	//
	//     var user_id = selected_user.id;
	//     UserFactory.changeActiveState(user_id).then(function(response){
	//         console.log(response);
	//         if (response.status) {
	//             swal({
	//                 title: "Good job!",
	//                 text: "The User has been updated successfully!",
	//                 type: "success",
	//                 timer: 2000
	//             });
	//             $scope.loadGroups();
	//         } else {
	//             console.error(response);
	//         }
	//     });
	// };

	// $scope.openDeleteGroupModal = function () {
	//     GenericFactory.get($scope.company_id).then(function (response) {
	//         if (response.status) {
	//             console.log(response.results);
	//             $scope.delete_group_list = response.results
	//             $("#deleteGroupModal").modal("show");
	//         }
	//     });
	// };

	// $scope.submitDeleteGroup = function () {
	//
	//     console.log(typeof($scope.delete_selected_group));
	//     console.log($scope.delete_selected_group);
	//     if (typeof($scope.delete_selected_group) != "undefined") {
	//         var current_group = $scope.delete_group_list[$scope.delete_selected_group];
	//
	//         if (current_group.users.length > 0) {
	//
	//             var alert_message = "The group that you are trying to delete still have {0} users!".format(
	//                 current_group.users.length
	//             );
	//             swal({
	//                 title: "Take it easy cowboy!",
	//                 text: alert_message,
	//                 type: "warning"
	//             });
	//         } else {
	//             GenericFactory.delete(current_group.id).then(function (response) {
	//                 if (response.status) {
	//                     swal({
	//                         title: "Good job!",
	//                         text: "The Group has been deleted successfully!",
	//                         type: "success",
	//                         timer: 2000
	//                     });
	//                     $("#deleteGroupModal").modal("hide");
	//                     $scope.loadGroups();
	//                 } else {
	//                     console.error(response);
	//                 }
	//             });
	//         }
	//     }
	//     // console.log($scope.delete_selected_group);
	//     // console.log($scope.delete_group_list);
	// };

	// plugins
	$('#login_start').formatter({
		'pattern': '{{99}}:{{99}}',
		'persistent': true
	});

	$('#login_end').formatter({
		'pattern': '{{99}}:{{99}}',
		'persistent': true
	});

}]);

app.factory("GroupFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.create = function (payload) {
		var q = $q.defer();

		var parameters = JSON.stringify(payload);
		var api = $rootScope.api_url + "user/group/";
		$http.post(
			api,
			parameters
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.get = function (company_id) {
		var q = $q.defer();

		var api = $rootScope.api_url + "user/group/" + company_id;
		console.log(api);
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.update = function (group_id, payload) {
		var q = $q.defer();

		var api = $rootScope.api_url + "user/group/" + group_id;
		var parameters = JSON.stringify(payload);
		$http.put(
			api,
			parameters
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.delete = function (group_id) {
		var q = $q.defer();

		var api = $rootScope.api_url + "user/group/" + group_id;
		$http.delete(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	return methods;
}]);

app.controller('CompanyCreateController', ["$scope", "$rootScope", "GenericFactory", "$state", function ($scope, $rootScope, GenericFactory, $state) {
	// Browser title
	$rootScope.page_title = "Company Setup";


	$scope.company = {};

	// TESTING WITH AUTOVALUES
	// $scope.company.cid = "aidi";
	// $scope.company.name = "company1";
	// $scope.company.address = "address1";
	// $scope.company.city = "city1";
	// $scope.company.state = "state1";
	// $scope.company.zip = 42315;
	// $scope.company.phone = 1234567890;
	// $scope.company.subdirectory = "subdirectory1";
	// $scope.company.nofp = 2; // Number of fiscal periods
	// $scope.company.df = "American"; // date format
	// $scope.company.hcurrency = 3; // home currency
	// $scope.company.fdofd = "05/20/1994"; // First day of fiscal day
	// $scope.company.cfy = "2007"; // Current fiscal year
	// $scope.company.sta = "USA"; // Sales tax address
	//
	// $scope.company.db_hostname = "11.11.11.11";
	// $scope.company.db_port = "3306";
	// $scope.company.db_username = "erick";
	// $scope.company.db_password = "password";

	$scope.createCompany = function () {

		$scope.company.fdofd = document.getElementById("company_fdfd").value;
		$scope.company.cfy = document.getElementById("company_cfy").value;
		$scope.company.db_schema = $scope.company.cid + '_db';

		GenericFactory.post("smcompany", $scope.company).then(function (response) {
			if (response.status) {
				$scope.company = {};
				swal({
					title: "Success!",
					text: "You have added a new Company.",
					type: "success"
				});
				$scope.loadCompanyToSideBar();
			} else {
				swal({
					title: "Error!",
					text: "Please, contact admin.",
					type: "error"
				});
			}
			console.log(response);
		});

	};


	// Plugins
	$('#company_fdfd').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});

	$('#company_cfy').formatter({
		'pattern': '{{9999}}',
		'persistent': true
	});

}]);

app.controller('CompanyDeleteController', ["$scope", "$rootScope", "GenericFactory", "$state", function ($scope, $rootScope, GenericFactory, $state) {
	// Browser title
	$rootScope.page_title = "Delete Company";

	$scope.selected_company_to_delete = {};

	$scope.company_list = [];
	$scope.loadCompanyList = function () {
		GenericFactory.get("smcompany").then(function (response) {
			if (response.status) {
				$scope.company_list = response.results;
			}
		});
	};
	$scope.loadCompanyList();

	$scope.deleteCompany = function () {
		var company_id = $scope.selected_company_to_delete.id;
		GenericFactory.delete("smcompany", company_id).then(function (response) {
			if (response.status) {
				$scope.selected_company_to_delete = {};
				swal({
					title: "Success!",
					text: "You have deleted the company.",
					type: "success"
				});
				$scope.loadCompanyToSideBar();
				$scope.loadCompanyList();
			} else {
				swal({
					title: "Error!",
					text: "Please, contact admin.",
					type: "error"
				});
			}
		});
	};


	// $scope.submitDeleteCompany = function() {
	//     var current_company = $scope.company_list[$scope.selected_company];
	//     // console.log(current_company);
	//
	//     if (typeof(current_company) != "undefined") {
	//         if (current_company.groups.length > 0) {
	//             var alert_message = "The company that you are trying to delete still have {0} groups!".format(
	//                 current_company.groups.length
	//             );
	//             swal({
	//                 title: "Take it easy cowboy!",
	//                 text: alert_message,
	//                 type: "warning"
	//             });
	//         } else {
	//             // alert("good to go {0}".format(current_company.id));
	//             GenericFactory.delete(current_company.id).then(function (response) {
	//                 if (response.status) {
	//                     swal({
	//                         title: "Good job!",
	//                         text: "The company has been deleted successfully!",
	//                         type: "success",
	//                         timer: 2000
	//                     });
	//                     $state.go("dashboard");
	//                     $scope.loadCompanyToSideBar();
	//                 } else {
	//                     console.error(response);
	//                 }
	//             });
	//         }
	//     }
	//
	// };

}]);

app.controller('CompanyEditController', ["$scope", "$rootScope", "GenericFactory", "$state", function ($scope, $rootScope, GenericFactory, $state) {
	// Browser title
	$rootScope.page_title = "Edit Company";

	$scope.selected_company_to_edit = {};

	$scope.company_list = [];
	$scope.loadCompanyList = function () {
		GenericFactory.get("smcompany").then(function (response) {
			if (response.status) {
				$scope.company_list = response.results;
			}
		});
	};

	$scope.loadCompanyList();


	$scope.editCompany = function () {

		var payload = $scope.selected_company_to_edit;
		GenericFactory.put("smcompany", payload).then(function (response) {
			if (response.status) {
				$scope.selected_company_to_edit = {};
				swal({
					title: "Success!",
					text: "You have edited the company.",
					type: "success"
				});
				$scope.loadCompanyToSideBar();
				$scope.loadCompanyList();
			} else {
				swal({
					title: "Error!",
					text: "Please, contact admin.",
					type: "error"
				});
			}
		});

	};


	// Plugins
	$('#company_fdfd').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});

	$('#company_cfy').formatter({
		'pattern': '{{9999}}',
		'persistent': true
	});

}]);

app.factory("CompanyFactory", ["$http", "$q", "$rootScope", function ($http, $q, $rootScope) {

	var methods = {};

	methods.get = function () {
		var q = $q.defer();

		var api = $rootScope.api_url + "company/";
		$http.get(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.update = function (company_id, payload) {
		var q = $q.defer();

		var api = $rootScope.api_url + "company/" + company_id;
		var parameters = JSON.stringify(payload);
		$http.put(
			api,
			parameters
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};

	methods.delete = function (company_id) {
		var q = $q.defer();

		var api = $rootScope.api_url + "company/" + company_id;
		$http.delete(
			api
		).success(function (data, status, headers, config) {
			q.resolve(data);
		}).error(function (data, status, headers, config) {
			q.reject(data);
		});

		return q.promise;
	};


	return methods;
}]);

app.controller('BankAccountController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Bank Account";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.bank_account = {};
	// $scope.bank_account = {"cbankname":"bname","cdescript":"des","cbankacc":"321321654","cbankroute":"231123312","cglacc":"1001","ccurrcode":"USD","caccttype":"C"};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.$watch("bank_account", function () {
		console.log($scope.bank_account);
	}, 1);

	$scope.bank_list = [];
	$scope.loadBankAccountList = function () {
		GenericFactory.get("cobank", "limit/-1", custom_headers).then(function (response) {
			if (response.status) {
				$scope.bank_list = response.results;
			}
		});
	};
	$scope.loadBankAccountList();

	$scope.glaccount_list = [];
	$scope.loadGLAccountList = function () {
		GenericFactory.get("glaccounts", "limit/-1", custom_headers).then(function (response) {
			if (response.status) {
				$scope.glaccount_list = response.results;
			}
		});
	};
	$scope.loadGLAccountList();

	$scope.currency_code_list = [];
	$scope.loadCurrencyCodeList = function () {
		GenericFactory.get("cocurr", "limit/-1", custom_headers).then(function (response) {
			if (response.status) {
				$scope.currency_code_list = response.results;
			}
		});
	};
	$scope.loadCurrencyCodeList();

	$scope.openBankAccountModal = function () {
		$("#SelectBankAccountModal").modal("show");
	};

	$scope.selectBankAccount = function (selected_bank) {
		$scope.bank_account = angular.copy(selected_bank);
		$("#SelectBankAccountModal").modal("hide");
	};

	$scope.openGLAccountsModal = function () {
		$("#SelectGLAccountModal").modal("show");
	};

	$scope.selectGLAccount = function (selected_gl_account) {
		$scope.bank_account.cglacc = selected_gl_account.id;
		$("#SelectGLAccountModal").modal("hide");
	};

	$scope.openCurrencyCodeModal = function () {
		$("#SelectCurrencyCodeModal").modal("show");
	};

	$scope.selectCurrencyCode = function (selected_currency_code) {
		$scope.bank_account.ccurrcode = selected_currency_code.ccurrcode;
		$("#SelectCurrencyCodeModal").modal("hide");
	};

	$scope.saveBankAccount = function () {
		var bank_account_payload = angular.copy($scope.bank_account);

		if (bank_account_payload.cbankname && bank_account_payload.cdescript) {

			GenericFactory.post("cobank", bank_account_payload, custom_headers).then(function (response) {
				if (response.status) {
					$scope.bank_account = {};

					$scope.loadBankAccountList();
					swal({
						title: "Success!",
						text: "You have added a new Bank Account",
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

		} else {
			swal({
				title: "Error!",
				text: "Please, at least fill the Code & Description fields",
				type: "error"
			});
		}

	};

	$scope.deleteBankAccount = function () {

		GenericFactory.delete("cobank", $scope.bank_account.id, custom_headers).then(function (response) {
			if (response.status) {
				$scope.bank_account = {};

				$scope.loadBankAccountList();
				swal({
					title: "Success!",
					text: "You have deleted the revenue code",
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

	$scope.updateBankAccount = function () {
		var bank_payload = angular.copy($scope.bank_account);
		GenericFactory.put("cobank", bank_payload, custom_headers).then(function (response) {
			if (response.status) {
				$scope.bank_account = {};

				$scope.loadBankAccountList();
				swal({
					title: "Success!",
					text: "You have updated the bank account",
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

	$scope.clearBankAccountForm = function () {
		$scope.bank_account = {};

		Alertify.log("Bank Account form has been cleaned successfully");
	};

}]);

app.controller('UserListController', ["$scope", "$rootScope", "GenericFactory", "$state", "$q", "UserService", function ($scope, $rootScope, GenericFactory, $state, $q, UserService) {

	$scope.user_edit_form = {};

	$scope.blockUser = function (user) {
		var payload = {};
		payload.id = user.id;
		payload.active = !(user.active == "1");
		GenericFactory.put("smuser", payload).then(function (response) {
			user.active = payload.active;
			alertify.success("User have succesfully been updated");
		});
	};

	// $scope.submitEditUser = function() {
	//     console.log($scope.user_edit_form);
	// };


	$scope.editUser = function (user) {
		$("#EditUserModal").modal("show");
		// console.log(user);
		$scope.user_edit_form = user;
		console.log($scope);
		// UserService.set(user);
		// $scope.initEditUserData();
		// $scope.user_edit_form = {};
		// console.log($scope.selected_smusergroup);
	};

	$scope.deleteUser = function (user) {
		$scope.user_list_to_show.forEach(function (current_user, index) {
			if (user.id == current_user.id) {
				$scope.user_list_to_show.splice(index, 1);

				let prom_list = [];
				GenericFactory.get("smusergrouphassmuser").then(function (response) {
					if (response.status) {
						response.results.forEach(function (row) {
							if (row.smuser.id == user.id) {
								prom_list.push(GenericFactory.delete("smusergrouphassmuser", row.id));
							}
						});
					}
				});

				GenericFactory.get("smuserhassmmodules").then(function (response) {
					if (response.status) {
						response.results.forEach(function (row) {
							if (row.smuser.id == user.id) {
								prom_list.push(GenericFactory.delete("smuserhassmmodules", row.id));
							}
						});
					}
				});

				$q.all(prom_list).then(function (response) {
					GenericFactory.delete("smuser", user.id).then(function (response) {
						if (response.status) {
							alertify.success("User deleted");
						} else {
							alertify.error("User deleted");
						}
					});
				});

			}
		});
	};

}]);

app.service("UserService", function () {
	var user = {};

	this.set = function (data) {
		user = data;
	}

	this.get = function () {
		return user;
	}
});

app.controller('PaycodeController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {
	// Browser title
	$rootScope.page_title = "Paycode";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

	$scope.paycode = {};
	$scope.paycode_type_list = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.paycode_list = [];
	$scope.loadPaycodeList = function () {
		GenericFactory.get("arpycd", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.paycode_list = response.results;
			}
		});
	};
	$scope.loadPaycodeList();

	$scope.customer_list = [];
	$scope.loadClientList = function () {
		GenericFactory.get("arcust", "", custom_headers).then(function (response) {
			if (response.status) {
				$scope.customer_list = response.results;
			}
		});
	};
	$scope.loadClientList();

	$scope.openPaycodeModal = function () {
		$("#SelectPaycodeModal").modal("show");
	};

	$scope.selectPaycode = function (selected_paycode) {
		$scope.paycode = angular.copy(selected_paycode);

		$("#SelectPaycodeModal").modal("hide");
	};

	$scope.savePaycode = function () {
		var payload = angular.copy($scope.paycode);

		if (payload.cpaycode && payload.cdescript) {
			GenericFactory.post("arpycd", payload, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadPaycodeList();
					$scope.paycode = {};
					swal({
						title: "Success!",
						text: "You have added a new Paycode",
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
		} else {
			swal({
				title: "Error!",
				text: "Please, at least fill the paycode NO & description",
				type: "error"
			});
		}

	};

	$scope.deletePaycode = function () {

		var paycode_in_customer = false;
		var customer_name_list = [];
		$scope.customer_list.some(function (customer) {
			if (customer.cpaycode == $scope.paycode.cpaycode) {
				paycode_in_customer = true;
				customer_name_list.push(customer.ccompany);
			}
		});

		if (paycode_in_customer) {
			var message = "";
			if (customer_name_list.length == 1) {
				message = "The selected paycode is already been used in the following customer: {0}".format(customer_name_list);
			} else {
				message = "The selected paycode is already been used in the following customers: {0}".format(customer_name_list);
			}
			// console.log(message);
			swal({
				title: "Hold on cowboy!",
				text: message,
				type: "warning"
			});
		} else {
			GenericFactory.delete("arpycd", $scope.paycode.id, custom_headers).then(function (response) {
				if (response.status) {
					$scope.loadPaycodeList();
					$scope.paycode = {};
					swal({
						title: "Success!",
						text: "You have deleted the paycode",
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

	$scope.updatePaycode = function () {
		var payload = angular.copy($scope.paycode);
		GenericFactory.put("arpycd", payload, custom_headers).then(function (response) {
			if (response.status) {
				$scope.loadPaycodeList();
				$scope.paycode = {};
				swal({
					title: "Success!",
					text: "You have updated the paycode",
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

	$scope.clearPaycodeForm = function () {
		$scope.paycode = {};
		$scope.paycode.npaytype = '1'
		Alertify.log("Paycode form has been cleaned successfully");
	};

}]);

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


	// console.log($scope.invoice);
	// $scope.disable_card_options = true;
	// console.log($scope.arcard_list);

	// $scope.invoice.cbankno = "";

	// $scope.card = {};
	// $scope.invoice_address1 = {};
	// $scope.invoice_address2 = {};
	// $scope.selecting_address_n = 1;
	// $scope.invoice_sales_tax = {};

	// $scope.invoice.order_date = new Date($scope.invoice.order_date);
	// $scope.invoice.invoice_date = new Date($scope.invoice.invoice_date);
	//
	// try {
	//     // if customer.cpaycode is set
	//     typeof($scope.customer.cpaycode);
	//     // console.log($scope.customer);
	//     $scope.setDefaultCompanyBank();
	// } catch (e) {}


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
	// var t1 = new Date($scope.invoice.order_date);
	// var t2 = new Date($scope.invoice.invoice_date);
	// $scope.invoice.order_date = t1.getFullYear() + "-" + (t1.getMonth() + 1) + "-" + t1.getDate();
	// $scope.invoice.invoice_date = t2.getFullYear() + "-" + (t2.getMonth() + 1) + "-" + t2.getDate();

}]);

app.controller('ArSetupBaseController', ["$scope", "$rootScope", "CompanyFactory", "$state", function ($scope, $rootScope, CompanyFactory, $state) {
	// Browser title
	$rootScope.page_title = "Setup General #1";

	// $rootScope.syst_selected_company = {"id":"7","cid":"sapi","name":"Qualfin SAPI","address":"address1","city":"city1","state":"state1","zip":"42315","phone":"1234567890","subdirectory":"subdirectory1","nofp":"2","df":"American","hcurrency":"USD","fdofd":"05/20/1994","cfy":"2007","sta":"USA","db_hostname":"11.11.11.11","db_port":"3306","db_username":"erick","db_password":"password","db_schema":"sapi_db","created":"2017-02-02 10:12:27","updated":null,"$$hashKey":"object:31"};

}]);

app.controller('ArSetupGeneral1Controller', ["$scope", "$rootScope", "GenericFactory", "$state", "$timeout", function ($scope, $rootScope, GenericFactory, $state, $timeout) {
	// Browser title
	$rootScope.page_title = "Setup General #1";

	// blue shadow
	$('[ui-sref="ar_setup_general_1"]').toggleClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_2"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_finance_charge"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_gl_accounts"]').removeClass("ar-menu-active");

	$scope.arsyst = {};

	$scope.arfrgt_list = [];
	$scope.arfob_list = [];

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	var arfrgt_prom = GenericFactory.get("arfrgt", "limit/-1", custom_headers);
	var arfob_prom = GenericFactory.get("arfob", "limit/-1", custom_headers);
	var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

	arfrgt_prom.then(function (response) {
		if (response.status) {
			$scope.arfrgt_list = response.results;
		}

		return arfob_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.arfob_list = response.results;
		}

		return arsyst_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.arsyst = response.results[0];
		}
	});

	$scope.updateArsystSettingsGeneral1 = function () {

		var payload = $scope.arsyst;
		if (payload.arfob) {
			payload.arfob_id = payload.arfob.id;
		}
		if (payload.arfrgt) {
			payload.arfrgt_id = payload.arfrgt.id;
		}

		delete payload.arfob;
		delete payload.arfrgt;
		delete payload.arpycd;
		delete payload.arwhse;
		delete payload.arrevn;

		payload.start_range = document.getElementById("start_range").value;
		payload.end_range = document.getElementById("end_range").value;
		payload.purge_invoices_dates = document.getElementById("purge_invoices_dates").value;
		payload.purge_payments_dates = document.getElementById("purge_payments_dates").value;

		GenericFactory.put("arsyst", payload, custom_headers).then(function (response) {
			if (response.status) {
				alertify.success("Settings have succesfully been updated");
			} else {
				alertify.error("Error, please contact admin");
				console.log(response);
			}
		});

	};


	// Plugin
	$('#ship_via').select2();
	$('#fob').select2();

	$('#purge_invoices_dates').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});
	$('#purge_payments_dates').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});
	$('#start_range').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});
	$('#end_range').formatter({
		'pattern': '{{99}}/{{99}}/{{9999}}',
		'persistent': true
	});

}]);

app.controller('ArSetupGeneral2Controller', ["$scope", "$rootScope", "GenericFactory", "$state", "$timeout", function ($scope, $rootScope, GenericFactory, $state, $timeout) {
	// Browser title
	$rootScope.page_title = "Setup General #2";

	$('[ui-sref="ar_setup_general_2"]').toggleClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_1"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_finance_charge"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_gl_accounts"]').removeClass("ar-menu-active");

	$scope.arsyst = {};

	$scope.arpycd_list = [];
	$scope.arwhse_list = [];
	$scope.arrevn_list = [];

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	var arpycd_prom = GenericFactory.get("arpycd", "limit/-1", custom_headers);
	var arwhse_prom = GenericFactory.get("arwhse", "limit/-1", custom_headers);
	var arrevn_prom = GenericFactory.get("arrevn", "limit/-1", custom_headers);
	var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

	arpycd_prom.then(function (response) {
		if (response.status) {
			$scope.arpycd_list = response.results;
		}

		return arwhse_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.arwhse_list = response.results;
		}

		return arrevn_prom;
	}).then(function (response) {
		if (response.status) {
			$scope.arrevn_list = response.results;
		}

		return arsyst_prom;
	}).then(function (response) {
		$scope.arsyst = response.results[0];
	});

	$scope.updateArsystSettingsGeneral2 = function () {

		var payload = $scope.arsyst;
		if (payload.arpycd) {
			payload.arpycd_id = payload.arpycd.id;
		}
		if (payload.arwhse) {
			payload.arwhse_id = payload.arwhse.id;
		}
		if (payload.arrevn) {
			payload.arrevn_id = payload.arrevn.id;
		}

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

	$("#pay_code").select2();
	$("#warehouse").select2();
	$("#revenue_code").select2();
}]);

app.controller('ArSetupGlAccountsController', ["$scope", "$rootScope", "GenericFactory", "$state", "$timeout", function ($scope, $rootScope, GenericFactory, $state, $timeout) {
	// Browser title
	$rootScope.page_title = "Setup GL Accounts";

	$('[ui-sref="ar_setup_gl_accounts"]').toggleClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_1"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_2"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_printing"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_finance_charge"]').removeClass("ar-menu-active");

	$scope.arsyst = {};

	var custom_headers = {
		headers: {
			"db-name": $rootScope.syst_selected_company.db_schema
		}
	};

	$scope.glaccounts_list = [];

	var glaccounts_prom = GenericFactory.get("glaccounts", "limit/-1", custom_headers);
	var arsyst_prom = GenericFactory.get("arsyst", "limit/-1", custom_headers);

	glaccounts_prom.then(function (response) {
		if (response.status) {
			$scope.glaccounts_list = response.results;
		}

		return arsyst_prom;
	}).then(function (response) {
		$scope.arsyst = response.results[0];

		$scope.glaccounts_list.forEach(function (gl_account, index) {

			if (gl_account.id == $scope.arsyst.account_receivables) {
				$scope.arsyst.account_receivables = gl_account;
			}
			if (gl_account.id == $scope.arsyst.inventory_stock) {
				$scope.arsyst.inventory_stock = gl_account;
			}
			if (gl_account.id == $scope.arsyst.inventory_non_stock) {
				$scope.arsyst.inventory_non_stock = gl_account;
			}
			if (gl_account.id == $scope.arsyst.customer_deposits) {
				$scope.arsyst.customer_deposits = gl_account;
			}
			if (gl_account.id == $scope.arsyst.open_credit_refunds) {
				$scope.arsyst.open_credit_refunds = gl_account;
			}
			if (gl_account.id == $scope.arsyst.sales_taxes_payables) {
				$scope.arsyst.sales_taxes_payables = gl_account;
			}
			if (gl_account.id == $scope.arsyst.invoice_adjustaments) {
				$scope.arsyst.invoice_adjustaments = gl_account;
			}
			if (gl_account.id == $scope.arsyst.freight_revenue) {
				$scope.arsyst.freight_revenue = gl_account;
			}
			if (gl_account.id == $scope.arsyst.interest_income) {
				$scope.arsyst.interest_income = gl_account;
			}
			if (gl_account.id == $scope.arsyst.cost_of_variances) {
				$scope.arsyst.cost_of_variances = gl_account;
			}
			if (gl_account.id == $scope.arsyst.inventory_adjustements) {
				$scope.arsyst.inventory_adjustements = gl_account;
			}
			if (gl_account.id == $scope.arsyst.payment_term_discount) {
				$scope.arsyst.payment_term_discount = gl_account;
			}
			if (gl_account.id == $scope.arsyst.payment_adjustements) {
				$scope.arsyst.payment_adjustements = gl_account;
			}
			if (gl_account.id == $scope.arsyst.bad_deb_expense) {
				$scope.arsyst.bad_deb_expense = gl_account;
			}

		});
	});

	$scope.updateArsystSettingsGlAccounts = function () {

		var payload = $scope.arsyst;

		if (payload.account_receivables) {
			payload.account_receivables = payload.account_receivables.id;
		}
		if (payload.inventory_stock) {
			payload.inventory_stock = payload.inventory_stock.id;
		}
		if (payload.inventory_non_stock) {
			payload.inventory_non_stock = payload.inventory_non_stock.id;
		}
		if (payload.customer_deposits) {
			payload.customer_deposits = payload.customer_deposits.id;
		}
		if (payload.open_credit_refunds) {
			payload.open_credit_refunds = payload.open_credit_refunds.id;
		}
		if (payload.sales_taxes_payables) {
			payload.sales_taxes_payables = payload.sales_taxes_payables.id;
		}
		if (payload.invoice_adjustaments) {
			payload.invoice_adjustaments = payload.invoice_adjustaments.id;
		}
		if (payload.freight_revenue) {
			payload.freight_revenue = payload.freight_revenue.id;
		}
		if (payload.interest_income) {
			payload.interest_income = payload.interest_income.id;
		}
		if (payload.cost_of_variances) {
			payload.cost_of_variances = payload.cost_of_variances.id;
		}
		if (payload.inventory_adjustements) {
			payload.inventory_adjustements = payload.inventory_adjustements.id;
		}
		if (payload.payment_term_discount) {
			payload.payment_term_discount = payload.payment_term_discount.id;
		}
		if (payload.payment_adjustements) {
			payload.payment_adjustements = payload.payment_adjustements.id;
		}
		if (payload.bad_deb_expense) {
			payload.bad_deb_expense = payload.bad_deb_expense.id;
		}

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


	// Plugin
	$("#account_receivables").select2();
	$("#inventory_stock").select2();
	$("#inventory_non_stock").select2();
	$("#customer_deposits").select2();
	$("#open_credit_refunds").select2();
	$("#sales_taxes_payables").select2();
	$("#invoice_adjustaments").select2();
	$("#freight_revenue").select2();
	$("#interest_income").select2();
	$("#cost_of_variances").select2();
	$("#inventory_adjustements").select2();
	$("#payment_term_discount").select2();
	$("#payment_adjustements").select2();
	$("#bad_deb_expense").select2();

}]);

app.controller('ArSetupPrintingController', ["$scope", "$rootScope", "GenericFactory", "$state", function ($scope, $rootScope, GenericFactory, $state) {
	// Browser title
	$rootScope.page_title = "Setup Printing";

	$('[ui-sref="ar_setup_printing"]').toggleClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_1"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_general_2"]').removeClass("ar-menu-active");
	$('[ui-sref="ar_setup_finance_charge"]').removeClass("ar-menu-active");
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

	$scope.updateArsystSettingsPrinting = function () {

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


app.controller('CreateUserGroupController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", function ($scope, $rootScope, $state, GenericFactory, $q) {

	// $scope.selected_company = {};
	// $scope.initCreateUserGroupData = function() {
	//
	//     $scope.usergroup_add_form = {};
	//     $scope.usergroup_add_form.company_list = {};
	//     $scope.usergroup_add_form.company_list = angular.copy($scope.company_list);
	//
	//     $scope.usergroup_add_form.company_list.forEach(function(company, index) {
	//         $scope.usergroup_add_form.company_list[index].modules = {};
	//         $scope.usergroup_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
	//     });
	// };
	// $scope.initCreateUserGroupData();

	$scope.selected_company = {};
	$scope.selectCompany = function (company) {
		$scope.selected_company = company;
	};

	$scope.rowClick = function (module) {
		if (typeof (module.selected) == "undefined") {
			module.selected = true;
		} else {
			if (module.selected) {
				module.selected = false;
			} else {
				module.selected = true;
			}
		}
	};

	$scope.submitAddGroup = function () {

		var group_payload = angular.copy($scope.usergroup_add_form);
		var company_list_payload = group_payload.company_list;
		delete group_payload.company_list;

		GenericFactory.post("smusergroup", group_payload).then(function (response) {
			if (response.status) {

				var prom_list = [];
				company_list_payload.forEach(function (company) {
					company.modules.forEach(function (module) {
						if (module.selected) {
							var payload = {};
							payload.smusergroup = {};
							payload.smmodules = {};
							payload.smcompany = {};
							payload.smusergroup.id = response.id;
							payload.smmodules.id = module.id;
							payload.smcompany.id = company.id;

							prom_list.push(GenericFactory.post("smusergrouphassmmodules", payload));
						}
					});
				});

				$q.all(prom_list).then(function (response) {
					// $scope.initCreateUserGroupData();
					// $scope.usergroup_add_form = {};
					// $scope.usergroup_add_form.company_list = [];
					// console.log($scope.usergroup_add_form);

					$scope.loadUserGroups();
					swal({
						title: "Success!",
						text: "Group added successfully",
						type: "success"
					});
					$("#CreateUserGroupModal").modal("hide");
				});
			} else {
				swal("Cancelled", "Unespected error, contact admin", "error");
				console.error("-------->");
				console.error(response);
				console.error("-------->");
			}

		});
	};

}]);

app.controller('DeleteUserGroupController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", function ($scope, $rootScope, $state, GenericFactory, $q) {

	// $scope.initDeleteUserGroupData = function() {
	//
	//     $scope.usergroup_delete_form = {};
	//     $scope.usergroup_delete_form.smusergroup_list = {};
	//     $scope.usergroup_delete_form.smusergroup_list = angular.copy($scope.smusergroup_list);
	// };
	// $scope.initDeleteUserGroupDa

	$scope.deleteUserGroupsModules = function () {
		GenericFactory.get("smusergrouphassmmodules").then(function (response) {
			if (response.status) {

				response.results.forEach(function (row) {
					if ($scope.usergroup_delete_form.selected_group.id == row.smusergroup.id) {
						GenericFactory.delete("smusergrouphassmmodules", row.id);
					}
				});

			}
		});
	};

	$scope.submitDeleteGroup = function () {
		// console.log($scope.usergroup_delete_form.selected_group);

		$scope.deleteUserGroupsModules();

		let group_id = $scope.usergroup_delete_form.selected_group.id;
		GenericFactory.delete("smusergroup", group_id).then(function (response) {
			console.log(response);
			if (response.status) {
				swal({
					title: "Good job!",
					text: "The Group has been deleted successfully!",
					type: "success",
					timer: 2000
				});
				delete $scope.usergroup_delete_form.selected_group;
				$scope.loadUserGroups();
				$("#DeleteUserGroupModal").modal("hide");
				// $scope.initDeleteUserGroupData();
			} else {
				console.log("error");
			}
		});
	};

}]);

app.controller('CreateUserController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", function ($scope, $rootScope, $state, GenericFactory, $q) {

	$scope.selected_company = {};
	$scope.selectCompany = function (company) {
		$scope.selected_company = company;
	};

	$scope.rowClick = function (module) {
		if (typeof (module.selected) == "undefined") {
			module.selected = true;
		} else {
			if (module.selected) {
				module.selected = false;
			} else {
				module.selected = true;
			}
		}
	};

	$scope.loadUserGroupsModules = function () {

		$scope.user_add_form.company_list = [];
		$scope.user_add_form.company_list = angular.copy($scope.company_list);
		$scope.user_add_form.company_list.forEach(function (company, index) {
			$scope.user_add_form.company_list[index].modules = [];
			$scope.user_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
		});

		$scope.selected_company = {};

		GenericFactory.get("smusergrouphassmmodules").then(function (response) {
			if (response.status) {

				response.results.forEach(function (row) {
					$scope.user_add_form.company_list.forEach(function (company) {
						if (company.id == row.smcompany.id && $scope.user_add_form.selected_group.id == row.smusergroup.id) {

							company.modules.forEach(function (module) {
								if (!module.selected) {
									if (row.smmodules.id == module.id) {
										module.selected = true;
									} else {
										module.selected = false;
									}
								}
							});
						}
					});
				});

			}
		});

	};

	$scope.submitCreateUser = function () {

		var user_payload = angular.copy($scope.user_add_form);
		user_payload.active = 1;
		user_payload.master = 0;
		var modules_payload = angular.copy($scope.user_add_form);

		delete user_payload.company_list;
		delete user_payload.usergroup_list;
		delete user_payload.selected_group;

		GenericFactory.post("smuser", user_payload).then(function (response) {
			if (response.status) {

				var prom_list = [];
				var group_has_user_payload = {};
				group_has_user_payload.smusergroup = {};
				group_has_user_payload.smusergroup.id = modules_payload.selected_group.id;
				group_has_user_payload.smuser = {};
				group_has_user_payload.smuser.id = response.id;

				prom_list.push(GenericFactory.post("smusergrouphassmuser", group_has_user_payload));

				modules_payload.company_list.forEach(function (company) {
					company.modules.forEach(function (module) {
						if (module.selected) {
							var payload = {};
							payload.smusergroup = {};
							payload.smusergroup.id = modules_payload.selected_group.id;
							payload.smcompany = {};
							payload.smcompany.id = company.id;
							payload.smmodules = {};
							payload.smmodules.id = module.id;
							payload.smuser = {};
							payload.smuser.id = response.id;

							prom_list.push(GenericFactory.post("smuserhassmmodules", payload));
						}
					});
				});

				$q.all(prom_list).then(function (response) {
					$scope.selected_company = {};

					$scope.smusergroup_list = [];
					$scope.user_list_to_show = [];
					$scope.loadUserGroups();

					$("#CreateUserModal").modal("hide");
					swal({
						title: "Success!",
						text: "User added successfully",
						type: "success"
					});
				});
			} else {
				swal("Cancelled", "Unespected error, contact admin", "error");
				console.error("-------->");
				console.error(response);
				console.error("-------->");
			}
		});

	};

}]);

app.controller('EditUserController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", "UserService", function ($scope, $rootScope, $state, GenericFactory, $q, UserService) {

	// $scope.user_edit_form = {};

	$scope.submitEditUser = function () {
		// console.log("asd");
		console.log(UserService.get());
	};

	// $scope.initEditUserData = function () {
	// };
	// $scope.initEditUserData();

	// $scope.selected_company = {};
	// $scope.selectCompany = function(company) {
	//     $scope.selected_company = company;
	// };
	//
	// $scope.rowClick = function(module) {
	//     if (typeof(module.selected) == "undefined") {
	//         module.selected = true;
	//     } else {
	//         if (module.selected) {
	//             module.selected = false;
	//         } else {
	//             module.selected = true;
	//         }
	//     }
	// };
	//
	// $scope.loadUserGroupsModules = function() {
	//
	//     $scope.user_add_form.company_list = [];
	//     $scope.user_add_form.company_list = angular.copy($scope.company_list);
	//     $scope.user_add_form.company_list.forEach(function(company, index) {
	//         $scope.user_add_form.company_list[index].modules = [];
	//         $scope.user_add_form.company_list[index].modules = angular.copy($scope.smmodules_list);
	//     });
	//
	//     $scope.selected_company = {};
	//
	//     GenericFactory.get("smusergrouphassmmodules").then(function(response) {
	//         if (response.status) {
	//
	//             response.results.forEach(function(row) {
	//                 $scope.user_add_form.company_list.forEach(function(company) {
	//                     if (company.id == row.smcompany.id && $scope.user_add_form.selected_group.id == row.smusergroup.id) {
	//
	//                         company.modules.forEach(function(module) {
	//                             if (!module.selected) {
	//                                 if (row.smmodules.id == module.id) {
	//                                     module.selected = true;
	//                                 } else {
	//                                     module.selected = false;
	//                                 }
	//                             }
	//                         });
	//                     }
	//                 });
	//             });
	//
	//         }
	//     });
	//
	// };

	// $scope.submitCreateUser = function() {
	//
	//     var user_payload = angular.copy($scope.user_add_form);
	//     user_payload.active = 1;
	//     user_payload.master = 0;
	//     var modules_payload = angular.copy($scope.user_add_form);
	//
	//     delete user_payload.company_list;
	//     delete user_payload.usergroup_list;
	//     delete user_payload.selected_group;
	//
	//     GenericFactory.post("smuser", user_payload).then(function(response) {
	//         if (response.status) {
	//
	//             var prom_list = [];
	//             modules_payload.company_list.forEach(function(company) {
	//                 company.modules.forEach(function(module) {
	//                     if (module.selected) {
	//                         var payload = {};
	//                         payload.smusergroup = {};
	//                         payload.smusergroup.id = modules_payload.selected_group.id;
	//                         payload.smcompany = {};
	//                         payload.smcompany.id = company.id;
	//                         payload.smmodules = {};
	//                         payload.smmodules.id = module.id;
	//                         payload.smuser = {};
	//                         payload.smuser.id = response.id;
	//
	//                         prom_list.push(GenericFactory.post("smuserhassmmodules", payload));
	//                     }
	//                 });
	//             });
	//
	//             $q.all(prom_list).then(function(response) {
	//                 $scope.selected_company = {};
	//                 $("#CreateUserModal").modal("hide");
	//                 swal({
	//                     title: "Success!",
	//                     text: "User added successfully",
	//                     type: "success"
	//                 });
	//             });
	//         } else {
	//             swal("Cancelled", "Unespected error, contact admin", "error");
	//             console.error("-------->");
	//             console.error(response);
	//             console.error("-------->");
	//         }
	//     });
	//
	// };

}]);

app.controller('EditUserGroupController', ["$scope", "$rootScope", "$state", "GenericFactory", "$q", "$timeout", function ($scope, $rootScope, $state, GenericFactory, $q, $timeout) {

	//
	// $timeout(function() {
	//     $("#EditUserGroupModal").modal("show");
	// }, 1000);

	var usergroupmodules_list = [];
	$scope.initEditUserGroupData = function () {
		$scope.usergroup_edit_form = {};

		$scope.selected_company = {};

		$scope.usergroup_edit_form = angular.copy($scope.edit_selected_smusergroup);
		$scope.usergroup_edit_form.company_list = angular.copy($scope.company_list);
		$scope.usergroup_edit_form.company_list.forEach(function (company, index) {
			$scope.usergroup_edit_form.company_list[index].modules = {};
			$scope.usergroup_edit_form.company_list[index].modules = angular.copy($scope.smmodules_list);
		});
	};

	$scope.selectUserGroup = function () {
		$scope.initEditUserGroupData();
		$scope.loadUserGroupsModules();
	};

	$scope.selected_company = {};
	$scope.selectCompany = function (company) {
		$scope.selected_company = company;
	};

	$scope.rowClick = function (module) {
		if (typeof (module.selected) == "undefined") {
			module.selected = true;
		} else {
			if (module.selected) {
				module.selected = false;
			} else {
				module.selected = true;
			}
		}
	};

	$scope.loadUserGroupsModules = function () {
		GenericFactory.get("smusergrouphassmmodules").then(function (response) {
			if (response.status) {
				// usergroupmodules_list = [];

				response.results.forEach(function (row) {
					// console.log(row);
					$scope.usergroup_edit_form.company_list.forEach(function (company) {
						if (company.id == row.smcompany.id && $scope.edit_selected_smusergroup.id == row.smusergroup.id) {
							usergroupmodules_list.push(row);
							console.log(row);

							company.modules.forEach(function (module) {
								if (!module.selected) {
									if (row.smmodules.id == module.id) {
										module.selected = true;
									} else {
										module.selected = false;
									}
								}
							});
						}
					});
				});

			}
		});
	};

	$scope.submitEditGroup = function () {

		var group_payload = angular.copy($scope.usergroup_edit_form);
		var company_list_payload = group_payload.company_list;
		delete group_payload.company_list;

		// console.log(usergroupmodules_list);
		//
		// throw new Error();
		GenericFactory.put("smusergroup", group_payload).then(function (response) {
			if (response.status) {
				let delete_prom = [];
				usergroupmodules_list.forEach(function (module_to_delete) {
					delete_prom.push(GenericFactory.delete("smusergrouphassmmodules", module_to_delete.id));
				});

				$q.all(delete_prom).then(function (response) {

					var prom_list = [];
					company_list_payload.forEach(function (company) {
						company.modules.forEach(function (module) {
							if (module.selected) {
								var payload = {};
								payload.smusergroup = {};
								payload.smmodules = {};
								payload.smcompany = {};
								payload.smusergroup.id = group_payload.id;
								payload.smmodules.id = module.id;
								payload.smcompany.id = company.id;

								prom_list.push(GenericFactory.post("smusergrouphassmmodules", payload));
							}
						});
					});

					$q.all(prom_list).then(function (response) {
						$scope.loadUserGroups();

						swal({
							title: "Success!",
							text: "Group added successfully",
							type: "success"
						});

						$("#EditUserGroupModal").modal("hide");
					});
				});
			} else {
				swal("Cancelled", "Unespected error, contact admin", "error");
				console.error("-------->");
				console.error(response);
				console.error("-------->");
			}

		});

	};

}]);

app.controller('ImportInvoiceController', ["$scope", "$rootScope", "$state", "GenericFactory", "Alertify", function ($scope, $rootScope, $state, GenericFactory, Alertify) {

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


	// console.log($scope.invoice);
	// $scope.disable_card_options = true;
	// console.log($scope.arcard_list);

	// $scope.invoice.cbankno = "";

	// $scope.card = {};
	// $scope.invoice_address1 = {};
	// $scope.invoice_address2 = {};
	// $scope.selecting_address_n = 1;
	// $scope.invoice_sales_tax = {};

	// $scope.invoice.order_date = new Date($scope.invoice.order_date);
	// $scope.invoice.invoice_date = new Date($scope.invoice.invoice_date);
	//
	// try {
	//     // if customer.cpaycode is set
	//     typeof($scope.customer.cpaycode);
	//     // console.log($scope.customer);
	//     $scope.setDefaultCompanyBank();
	// } catch (e) {}


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


	// console.log($scope.invoice);
	// $scope.disable_card_options = true;
	// console.log($scope.arcard_list);

	// $scope.invoice.cbankno = "";

	// $scope.card = {};
	// $scope.invoice_address1 = {};
	// $scope.invoice_address2 = {};
	// $scope.selecting_address_n = 1;
	// $scope.invoice_sales_tax = {};

	// $scope.invoice.order_date = new Date($scope.invoice.order_date);
	// $scope.invoice.invoice_date = new Date($scope.invoice.invoice_date);
	//
	// try {
	//     // if customer.cpaycode is set
	//     typeof($scope.customer.cpaycode);
	//     // console.log($scope.customer);
	//     $scope.setDefaultCompanyBank();
	// } catch (e) {}


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
