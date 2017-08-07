<?php

class CompanyModel {

    function __construct() {}

    function createDatabase($sql_query) {
        R::exec($sql_query);
        return TRUE;
    }
}

?>
