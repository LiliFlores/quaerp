<?php

class Arcadr {

    function __construct() {}

    function get() {

        $items = R::findAll("arcadr");
        $response = $items;

        return $response;
    }

}
