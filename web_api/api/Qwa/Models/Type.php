<?php

class Type {

    function __construct() {}

    function get($ctype) {
        if (empty($ctype)) {
            $types = R::findAll("ictype");
            $response = $types;
        } else {
            $type = R::find("ictype", "ctype = ?", [$ctype]);
            $response = $type;
        }

        return $response;
    }

}
