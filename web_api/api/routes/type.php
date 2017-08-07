<?php

$app->get("/type(/)(:id)", function($id = "") {

    $type_manager = new Type();
    $manager_response = $type_manager->get($id);

    $status  = TRUE;
    $message = "data found";

    // if (!count($manager_response)) {
    //     $results = array();
    //     $status  = FALSE;
    //     $message = "No data found";
    // }
    //
    // $response = array(
    //     "results" => array_values($manager_response),
    //     "status"  => $status,
    //     "message" => $message
    // );

    echo json_encode(array_values($manager_response));
});
