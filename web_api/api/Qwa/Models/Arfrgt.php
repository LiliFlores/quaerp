<?php

class Arfrgt {

    function __construct() {}

    function get() {
        $company = R::findAll("arfrgt");
        return $company;
    }

}
