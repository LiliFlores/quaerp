<?php

class Arslpn {

    function __construct() {}

    function get() {

        $sales_person = R::findAll("arslpn");
        $response = $sales_person;

        return $response;
    }

}
