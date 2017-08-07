<?php

$app->get("/employee(/)(:barcode)", function($barcode = "") {

    $employee_manager = new Employee();
    $manager_response = $employee_manager->get($barcode);

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/employee(/)", function() use ($app) {

    $payload = json_decode($app->request->getBody());

    $employee_manager = new Employee();
    $manager_response = $employee_manager->set($payload);

    $status  = TRUE;
    $message = "employee added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});
