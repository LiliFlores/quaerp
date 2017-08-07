<?php

class Arwhse {

    function __construct() {}

    function get() {
        $arwhse = R::findAll("arwhse");
        return $arwhse;
    }

}
