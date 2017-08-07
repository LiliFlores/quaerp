<?php

$app->get("/user(/)(:id)", function($id = "") {

    $user_manager = new User();
    $manager_response = $user_manager->get($id);

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    // "results" => array_values($manager_response),
    $response = array(
        "results" => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/user(/)", function() use ($app) {

    $payload = json_decode($app->request->getBody());

    $user_manager = new User();
    $manager_response = $user_manager->set($payload);


    $status  = TRUE;
    $message = "user added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->put("/user/(:id)", function($id) use ($app) {

    $payload = json_decode($app->request->getBody());

    $user_manager = new User();
    $manager_response = $user_manager->update($id, $payload);


    $status  = TRUE;
    $message = "user updated successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->delete("/user/(:id)", function ($id) {

    $user_manager = new User();
    $manager_response = $user_manager->delete($id);

    $response = array(
        "status"  => TRUE,
        "message" => "user deleted successfully"
    );

    echo json_encode($response);
});

/*
    Payload:
    {
        "username": "ealvarez",
        "password": "password"
    }
*/
$app->post("/user/login(/)", function() use ($app) {

    $payload = json_decode($app->request->getBody());

    $user_manager = new User();
    $manager_response = $user_manager->login($payload);

    $status  = TRUE;
    $message = "user added successfully";
    $response = array(
        "token" => $manager_response["token"],
        "status" => $manager_response["is_valid"],
        "message" => $manager_response["message"]
    );

    echo json_encode($response);
});

$app->get("/user/changestate/(:id)", function($id = "") {

    $user_manager = new User();
    $manager_response = $user_manager->changeActiveState($id);

    if ($manager_response) {
        $status  = TRUE;
        $message = "ok";
    } else {
        $status  = FALSE;
        $message = "error";
    }

    $response = array(
        "results" => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});
