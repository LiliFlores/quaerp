<?php

class Employee {

    function __construct() {}

    function get($barcode = "!default-") {
        if ($barcode == "!default-" || strlen($barcode) == 0) {
            $employee = R::findAll("employee");
        } else {
            $employee = R::find("employee", "barcode = ?", [$barcode]);
        }
        return $employee;
    }

    function set($payload) {
        $employee = R::dispense('employee');

        $continue = TRUE;
        if (!isset($payload->barcode)) {
            $barcode = $payload->barcode;
            $continue = FALSE;
        }
        if (!isset($payload->name)) {
            $name = $payload->name;
            $continue = FALSE;
        }
        if (!isset($payload->job)) {
            $job = $payload->job;
            $continue = FALSE;
        }

        if ($continue) {

        }

        $employee->barcode = $payload->barcode;
        $employee->name    = $payload->name;
        $employee->job     = $payload->job;
        $employee->created = date("Y-m-d", time());

        $id = R::store($employee);
        return $id;
    }

}
