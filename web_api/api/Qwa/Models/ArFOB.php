<?php

class ArFOB {

    function __construct() {}

    function get() {
        $company = R::findAll("arfob");
        return $company;
    }

}
