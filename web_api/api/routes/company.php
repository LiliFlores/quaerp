<?php

$app->get("/company(/)(:id)", function($id = "") {

    $company_manager = new Company();
    $manager_response = $company_manager->get($id);

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

$app->post("/company(/)", function() use ($app) {
    // $payload = json_decode($app->request->getBody());

    $payload = json_decode(json_encode($_POST));

    $company_manager = new Company();
    $manager_response = $company_manager->set($payload);

    $status  = TRUE;
    $message = "company added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->put("/company/(:id)", function($id = "") use ($app) {

    $payload = json_decode($app->request->getBody());

    $company_manager = new Company();
    $manager_response = $company_manager->update($id, $payload);

    if ($manager_response) {
        $message = "company updated successfully";
    } else {
        $message = "error";
    }

    $response = array(
        "status"  => $manager_response,
        "message" => $message
    );

    echo json_encode($response);
});

$app->delete("/company/(:id)", function ($id = "") {

    $company_manager = new Company();
    $manager_response = $company_manager->delete($id);

    if ($manager_response) {
        $message = "company deleted successfully";
    } else {
        $message = "error";
    }

    $response = array(
        "status"  => $manager_response,
        "message" => $message
    );

    echo json_encode($response);
});
