<?php

class ArPrinting {

    function __construct() {}

/*
    Payload:
    {
        "invoices": "1",
        "pslips": "1",
        "statements": "1",
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

        $ar_setup->invoices = $payload->invoices;
        $ar_setup->pslips = $payload->pslips;
        $ar_setup->statements = $payload->statements;

        $ar_setup->created = $now->format('Y-m-d H:i:s');

        $id = R::store($ar_setup);

        return $id;
    }
}
