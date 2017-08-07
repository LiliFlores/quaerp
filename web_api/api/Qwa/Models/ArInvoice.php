<?php

class ArInvoice {

    function __construct() {}

    function get($invoice_id) {
        $type = 0;
        if (empty($invoice_id)) {
            $invoice = R::findAll("arinvoice");
        } else {
            $invoice = R::findOne("arinvoice", "cinvno = ?", [$invoice_id]);
            $type = 1;
        }

        $item = R::findAll("aritrs");

        return array(
            "type" => $type,
            "invoice" => $invoice,
            "item" => $item
        );
    }

    function set($payload) {

        $status = FALSE;
        $invoice_already_exists = R::findOne("arinvoice", "cinvno = ?", [$payload->next_invoice]);

        if (empty($invoice_already_exists)) {
            $invoice = R::dispense('arinvoice');

            $now = new DateTime();

            $arirmk = R::findOne("arirmk", "code = ?", [$payload->remark->code]);

            if (empty($arirmk)) {
                $arirmk = R::dispense('arirmk');
                $arirmk->code = $payload->remark->code;
                $arirmk->remarks = $payload->remark->remarks;
                $remark_id = R::store($arirmk);
            } else {
                $remark_id = $arirmk->id;
            }

            $invoice->active = TRUE;

            $invoice->cinvno = $payload->next_invoice;
            $invoice->cwarehouse = $payload->arwhse->cwarehouse;
            $invoice->sidemarkno = $payload->sidemarkno;
            $invoice->sono = $payload->sono;
            $invoice->corderby = $payload->corderby;
            $invoice->cslpnno = $payload->sales_person->cslpnno;
            $invoice->cshipvia = $payload->ship_via->description;
            $invoice->cfob = $payload->fob->code;
            $invoice->cpono = $payload->cpono;
            $invoice->dorder = $payload->order_date;
            $invoice->dinvoice = $payload->invoice_date;
            $invoice->remark = $payload->remark->code;

            $invoice->costax = $payload->sales_tax->id;
            $invoice->nxchgrate = $payload->currency;

            // nsalesamt *//
            // nfrtamt * //
            // nfsalesamt * //
            // nfdiscamt * //
            // nftaxamt1 * //

            // foreign
            $invoice->nfsalesamt = $payload->subtotal;
            $invoice->nfdiscamt = $payload->total_discount;
            $invoice->nftaxamt1 = $payload->overwrite_sales_tax;
            $invoice->nfbalance = $payload->total;
            $invoice->nffrtamt = $payload->freight;

            // mx
            $ntaxamt1 = (1 / floatval($payload->currency)) * floatval($invoice->nftaxamt1);
            $invoice->ntaxamt1 = number_format((float)$ntaxamt1, 2, '.', '');

            $ndiscamt = (1 / floatval($payload->currency)) * floatval($invoice->nfdiscamt);
            $invoice->ndiscamt = number_format((float)$ndiscamt, 2, '.', '');

            $nsalesamt = (1 / floatval($payload->currency)) * floatval($invoice->nfsalesamt);
            $invoice->nsalesamt = number_format((float)$nsalesamt, 2, '.', '');

            $nfrtamt = (1 / floatval($payload->currency)) * floatval($invoice->nffrtamt);
            $invoice->nfrtamt = number_format((float)$nfrtamt, 2, '.', '');

            $nbalance = (1 / floatval($payload->currency)) * floatval($invoice->nfbalance);
            $invoice->nbalance = number_format((float)$nbalance, 2, '.', '');

            $ndiscamt = (1 / floatval($payload->currency)) * floatval($invoice->nfdiscamt);
            $invoice->ndiscamt = number_format((float)$ndiscamt, 2, '.', '');

            $invoice->ccustno = $payload->customer->ccustno;
            $invoice->ccurrcode = $payload->customer->ccurrcode;
            $invoice->nadjamt = $payload->adjustment;

            $invoice->cbcompany = $payload->address1->ccompany;
            $invoice->cbaddr1 = $payload->address1->caddr1;
            $invoice->cbaddr2 = $payload->address1->caddr2;
            $invoice->cbcity = $payload->address1->ccity;
            $invoice->cbstate = $payload->address1->cstate;
            $invoice->cbzip = $payload->address1->czip;
            $invoice->cbcountry = $payload->address1->ccountry;
            $invoice->cbphone = $payload->address1->cphone;
            $invoice->cbcontact = $payload->address1->ccontact;

            $invoice->cscompany = $payload->address2->ccompany;
            $invoice->csaddr1 = $payload->address2->caddr1;
            $invoice->csaddr2 = $payload->address2->caddr2;
            $invoice->cscity = $payload->address2->ccity;
            $invoice->csstate = $payload->address2->cstate;
            $invoice->cszip = $payload->address2->czip;
            $invoice->cscountry = $payload->address2->ccountry;
            $invoice->csphone = $payload->address2->cphone;
            $invoice->cscontact = $payload->address2->ccontact;

            $invoice->notepad = $payload->notepad;

            $invoice->created = $now->format('Y-m-d H:i:s');


            $id = R::store($invoice);

            if (isset($payload->company)) {
                $arsyst = R::findOne("arsyst", "company_id = ?", [$payload->company]);
                $arsyst->next_invoice = $payload->next_invoice + 1;
                R::store($arsyst);
            }

            if (count($payload->items)) {
                foreach ($payload->items as $item) {
                    $aritrs = R::dispense("aritrs");
                    $aritrs->ccustno = $payload->customer->ccustno;
                    $aritrs->cwarehouse = $payload->customer->cwarehouse;
                    $aritrs->cinvno = $payload->next_invoice;
                    $aritrs->citemno = $item->citemno;
                    $aritrs->cdescript = $item->cdescript;
                    $aritrs->ndiscrate = floatval($item->discount);
                    $aritrs->nordqty = floatval($item->shipqty);
                    $aritrs->nshipqty = floatval($item->shipqty);
                    $aritrs->nfprice = floatval($item->nprice);
                    $aritrs->nfsalesamt = floatval($item->nprice) * floatval($item->shipqty);
                    $aritrs->nfdiscamt = (floatval($item->nprice) * floatval($item->shipqty) * floatval($item->discount)/100);

                    $nsalesamt = (1 / floatval($payload->currency)) * $aritrs->nfsalesamt;
                    $aritrs->nsalesamt = number_format((float)$nsalesamt, 2, '.', '');

                    $ndiscamt = (1 / floatval($payload->currency)) * $aritrs->nfdiscamt;
                    $aritrs->ndiscamt = number_format((float)$ndiscamt, 2, '.', '');

                    $nprice = (1 / floatval($payload->currency)) * $aritrs->nfprice;
                    $aritrs->nprice = number_format((float)$nprice, 2, '.', '');

                    $aritrs->created = $now->format('Y-m-d H:i:s');
                    R::store($aritrs);
                }
            }

            $status = TRUE;
        }

        return $status;
    }

    function update($invoice_no, $payload) {

        $invoice_items = R::findAll("aritrs", "cinvno = ?", [$invoice_no]);
        R::trashAll($invoice_items);
        $invoice = R::findOne("arinvoice", "cinvno = ?", [$invoice_no]);
        R::trash($invoice);

        $response = $this->set($payload);

        return $response;
    }

    function disable($invoice_id) {
        $invoice = R::findOne("arinvoice", "id = ?", [$invoice_id]);
        $invoice->active = FALSE;
        R::store($invoice);
        return TRUE;
    }
}
