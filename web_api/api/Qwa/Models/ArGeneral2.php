<?php

class ArGeneral2 {

    function __construct() {}

    function get() {
        $general_config = R::findAll("arsyst");
        return $general_config;
    }

/*
    Payload:
    {
        "credit_limit": 212121,
        "pay_code": null,
        "warehouse": null,
        "revenue_code": null,
        "statement": "print_balance_forward",
        "umtpboet": true,
        "company_id": "4"
    }
*/
    function set($payload) {

        $company = R::findOne("company", "id = ?", [$payload->company_id]);
        $ar_setup = R::findOne("arsyst", "company_id = ?", [$payload->company_id]);

        $arpycd = R::findOne("arpycd", "id = ?", [$payload->pay_code]);
        $arwhse = R::findOne("arwhse", "id = ?", [$payload->warehouse]);
        $arrevn = R::findOne("arrevn", "id = ?", [$payload->revenue_code]);

        if (empty($ar_setup)) {
            $ar_setup = R::dispense('arsyst');
        }

        $now = new DateTime();

        $ar_setup->company = $company;

        // arpycd codigo pago
        // arwhse warehouse
        // arrevn revenue
        $ar_setup->credit_limit = $payload->credit_limit;

        if (!empty($arpycd)) {
            $ar_setup->arpycd = $arpycd;
        }
        if (!empty($arwhse)) {
            $ar_setup->arwhse = $arwhse;
        }
        if (!empty($arrevn)) {
            $ar_setup->arrevn = $arrevn;
        }

        $ar_setup->statement = $payload->statement;
        $ar_setup->umtpboet = $payload->umtpboet;

        $ar_setup->created = $now->format('Y-m-d H:i:s');

        $id = R::store($ar_setup);

        return $id;
    }
}
