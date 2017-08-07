<?php

class ArGeneral1 {

    function __construct() {}

    function get() {
        $general_config1 = R::findAll("arsyst");
        return $general_config1;
    }

/*
    Payload:
    {
        "start_range": "00/11/2222",
        "end_range": "01/02/2002",
        "purge_invoices_dates": "11/21/1212",
        "purge_payments_dates": "11/21/1212",
        "unit_cost": 22,
        "unit_price": 11,
        "quantity": 33,
        "ship_via": "1",
        "fob": "1",
        "freight_code": "2",
        "next_invoice": 100518,
        "usgi": false,
        "atelc": true,
        "anging_range_date_1": 1111,
        "anging_range_date_2": 1212,
        "anging_range_date_3": 2222,
        "anging_range_date_4": 2121,
        "idescription": true,
        "dpercentage": true,
        "uprice": true,
        "remark": true,
        "cfcbw": true,
        "company_id": "4"
    }
*/
    function set($payload) {

        $company = R::findOne("company", "id = ?", [$payload->company_id]);
        $ar_general_setup = R::findOne("arsyst", "company_id = ?", [$payload->company_id]);

        $arfrgt = R::findOne("arfrgt", "id = ?", [$payload->ship_via]);
        $arfob = R::findOne("arfob", "id = ?", [$payload->fob]);

        if (empty($ar_general_setup)) {
            $ar_general_setup = R::dispense('arsyst');
        }

        $now = new DateTime();

        $ar_general_setup->company = $company;

        $ar_general_setup->start_range = $payload->start_range;
        $ar_general_setup->end_range = $payload->end_range;
        $ar_general_setup->purge_invoices_dates = $payload->purge_invoices_dates;
        $ar_general_setup->purge_payments_dates = $payload->purge_payments_dates;
        $ar_general_setup->unit_cost = $payload->unit_cost;
        $ar_general_setup->unit_price = $payload->unit_price;
        $ar_general_setup->quantity = $payload->quantity;

        if (!empty($arfrgt)) {
            $ar_general_setup->ship_via = $arfrgt;
        }

        if (!empty($arfob)) {
            $ar_general_setup->fob = $arfob;
        }

        $ar_general_setup->next_invoice = $payload->next_invoice;
        $ar_general_setup->usgi = $payload->usgi;
        $ar_general_setup->atelc = $payload->atelc;
        $ar_general_setup->anging_range_date_1 = $payload->anging_range_date_1;
        $ar_general_setup->anging_range_date_2 = $payload->anging_range_date_2;
        $ar_general_setup->anging_range_date_3 = $payload->anging_range_date_3;
        $ar_general_setup->anging_range_date_4 = $payload->anging_range_date_4;
        $ar_general_setup->idescription = $payload->idescription;
        $ar_general_setup->dpercentage = $payload->dpercentage;
        $ar_general_setup->uprice = $payload->uprice;
        $ar_general_setup->remark = $payload->remark;
        $ar_general_setup->cfcbw = $payload->cfcbw;
        $ar_general_setup->uprice = $payload->uprice;

        $ar_general_setup->created = $now->format('Y-m-d H:i:s');

        $id = R::store($ar_general_setup);

        return $id;
    }
}
