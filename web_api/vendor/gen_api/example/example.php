<?php

    // php5.6-xml
    // php-simplexml
    // php5.6-mbstring

    // ini_set('display_errors', 'Off');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    date_default_timezone_set('America/Tijuana');

    require("rb.php");
    require("lib/0.1/api.php");

    $api->setDatabaseData("11.11.11.11", "sapi_db", "3306", "erick", "password");
    $api->setUriBase("gen_api/example");

    $api->setGenericCRUD();

?>
