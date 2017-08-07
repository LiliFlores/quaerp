<?php

$app->get("/inventory(/)(:id)", function($id = "") {

    $customer_manager = new Customer();
    $manager_response = $customer_manager->get($id);

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
