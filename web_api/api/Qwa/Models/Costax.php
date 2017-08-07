<?php

class Costax {

    function __construct() {}

    function get() {

        $tax = R::findAll("costax");
        $response = $tax;

        return $response;
    }

}
