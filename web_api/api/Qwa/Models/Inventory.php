<?php

class Inventory {

    function __construct() {}

    function get($id) {

        if (empty($id)) {
            $customer = R::findAll("arcust");
            $response = $customer;
        } else {
            $customer = R::find("arcust", "id = ?", [$id]);
            $response = $customer;
        }

        return $response;
    }

}
