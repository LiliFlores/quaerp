<?php

class ArGlAccounts {

    function __construct() {}

    function get() {
        $glaccounts = R::findAll("glaccounts");
        return $glaccounts;
    }


    /*
        Payload:
        {
            "account_receivables": "1001",
            "inventory_stock": null,
            "inventory_non_stock": null,
            "customer_deposits": null,
            "open_credit_refunds": null,
            "sales_taxes_payables": null,
            "invoice_adjustaments": null,
            "freight_revenue": null,
            "interest_income": null,
            "cost_of_variances": null,
            "inventory_adjustements": null,
            "payment_term_discount": null,
            "payment_adjustements": null,
            "bad_deb_expense": null,
            "company_id": "4"
        }
    */
    function set($payload) {

        $company = R::findOne("company", "id = ?", [$payload->company_id]);
        $ar_setup = R::findOne("arsyst", "company_id = ?", [$payload->company_id]);

        if (empty($ar_setup)) {
            $ar_setup = R::dispense('arsyst');
        }

        $now = new DateTime();

        $ar_setup->company = $company;

        // $ar_setup->account_receivables = R::findOne("glaccounts", "id = ?", [$payload->account_receivables]);
        // $ar_setup->inventory_stock = R::findOne("glaccounts", "id = ?", [$payload->inventory_stock]);
        // $ar_setup->inventory_non_stock = R::findOne("glaccounts", "id = ?", [$payload->inventory_non_stock]);
        // $ar_setup->customer_deposits = R::findOne("glaccounts", "id = ?", [$payload->customer_deposits]);
        // $ar_setup->open_credit_refunds = R::findOne("glaccounts", "id = ?", [$payload->open_credit_refunds]);
        // $ar_setup->sales_taxes_payables = R::findOne("glaccounts", "id = ?", [$payload->sales_taxes_payables]);
        // $ar_setup->invoice_adjustaments = R::findOne("glaccounts", "id = ?", [$payload->invoice_adjustaments]);
        // $ar_setup->freight_revenue = R::findOne("glaccounts", "id = ?", [$payload->freight_revenue]);
        // $ar_setup->interest_income = R::findOne("glaccounts", "id = ?", [$payload->interest_income]);
        // $ar_setup->cost_of_variances = R::findOne("glaccounts", "id = ?", [$payload->cost_of_variances]);
        // $ar_setup->inventory_adjustements = R::findOne("glaccounts", "id = ?", [$payload->inventory_adjustements]);
        // $ar_setup->payment_term_discount = R::findOne("glaccounts", "id = ?", [$payload->payment_term_discount]);
        // $ar_setup->payment_adjustements = R::findOne("glaccounts", "id = ?", [$payload->payment_adjustements]);
        // $ar_setup->bad_deb_expense = R::findOne("glaccounts", "id = ?", [$payload->bad_deb_expense]);

        $ar_setup->account_receivables = $payload->account_receivables;
        $ar_setup->inventory_stock = $payload->inventory_stock;
        $ar_setup->inventory_non_stock = $payload->inventory_non_stock;
        $ar_setup->customer_deposits = $payload->customer_deposits;
        $ar_setup->open_credit_refunds = $payload->open_credit_refunds;
        $ar_setup->sales_taxes_payables = $payload->sales_taxes_payables;
        $ar_setup->invoice_adjustaments = $payload->invoice_adjustaments;
        $ar_setup->freight_revenue = $payload->freight_revenue;
        $ar_setup->interest_income = $payload->interest_income;
        $ar_setup->cost_of_variances = $payload->cost_of_variances;
        $ar_setup->inventory_adjustements = $payload->inventory_adjustements;
        $ar_setup->payment_term_discount = $payload->payment_term_discount;
        $ar_setup->payment_adjustements = $payload->payment_adjustements;
        $ar_setup->bad_deb_expense = $payload->bad_deb_expense;


        $ar_setup->created = $now->format('Y-m-d H:i:s');

        $id = R::store($ar_setup);

        return $id;
    }
}
