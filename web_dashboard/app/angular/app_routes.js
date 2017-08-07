app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

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
            requireActiveSession: ["UserSession", function(UserSession) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
    }).state("inventory_remark", {
        url: "/remark",
        parent: "inventory_setup",
        views: {
            "inventory_setup_content@inventory_setup": {
                templateUrl: "modules/maintenance/inventory/remarkimage/InventorySetupRemarkImageView.html",
                controller: "InventorySetupRemarkImageController"
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
    }).state("inventory_analysis", {
        url: "/analysis",
        parent: "inventory_setup",
        views: {
            "inventory_setup_content@inventory_setup": {
                templateUrl: "modules/maintenance/inventory/analysis/InventorySetupAnalysisView.html",
                controller: "InventorySetupAnalysisController"
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
            requireModuleAccess: ["ModuleAccess", function(ModuleAccess) {
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
