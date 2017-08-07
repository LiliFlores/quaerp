<?php

class Arpycd {

    function __construct() {}

    function get() {
        $arpycd = R::findAll("arpycd");
        return $arpycd;
    }

}
