<?php

class AuthModules {

    function __construct() {}

    function get() {
        $authmodules = R::findAll("authmodules");
        return $authmodules;
    }
}
