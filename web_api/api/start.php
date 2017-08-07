<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

date_default_timezone_set('America/Tijuana');

require "../vendor/redbean/rb.php";
require "../vendor/gen_api/lib/0.1/api.php";

//$api->setDatabaseData("mysql.quaerp.dreamhosters.com", "sm_quaerp", "3306", "erick", "password");
$api->setDatabaseData("localhost", "litecode_sm_quaerp", "3306", "litecode_quaerp", "L!t3c0d3Quaerp");
$api->setUriBase("quaerp/web_api/api");

require "modules/modules.php";

$api->setGenericCRUD();
