<?php

class Arrevn {

    function __construct() {}

    function get() {
        $arrevn = R::findAll("arrevn");
        return $arrevn;
    }

}
