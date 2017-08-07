<?php

class Item {

    function __construct() {}

    function get($id) {

        if (empty($id)) {
            $items = R::findAll("icitem");
            $response = $items;
        } else {
            $item = R::find("icitem", "id = ?", [$id]);
            $response = $item;
        }

        return $response;
    }

}
