<?php

class ArFinanceCharge {

    function __construct() {}

/*
    Payload:
    {
        "cpd": 10,
        "msb": 20,
        "charge": 30,
        "mca": 40,
        "pdib": true,
        "prate": false,
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

        $ar_setup->cpd = $payload->cpd;
        $ar_setup->msb = $payload->msb;
        $ar_setup->charge = $payload->charge;
        $ar_setup->mca = $payload->mca;
        $ar_setup->pdib = $payload->pdib;
        $ar_setup->prate = $payload->prate;

        $ar_setup->created = $now->format('Y-m-d H:i:s');

        $id = R::store($ar_setup);

        return $id;
    }
}
