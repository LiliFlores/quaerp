<?php

class Arcard {

    function __construct() {}

    function get() {

        $items = R::findAll("arcard");
        $response = $items;

        return $response;
    }

}
