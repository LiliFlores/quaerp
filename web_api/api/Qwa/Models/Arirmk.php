<?php

class Arirmk {

    function __construct() {}

    function get() {

        $remark = R::findAll("arirmk");
        $response = $remark;

        return $response;
    }

}
