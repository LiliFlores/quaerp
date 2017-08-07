<?php

$app->get("/authmodules(/)", function() {

    $authmodules_manager = new AuthModules();
    $manager_response = $authmodules_manager->get();

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
