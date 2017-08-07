<?php

$app->get("/user/group(/)(:id)", function($id = "") {

    $usergroup_manager = new UserGroup();
    $manager_response = $usergroup_manager->get($id);

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

    echo json_encode($response, JSON_PRETTY_PRINT);
});

$app->post("/user/group(/)", function() use ($app) {

    $payload = json_decode($app->request->getBody());

    $usergroup_manager = new UserGroup();
    $manager_response = $usergroup_manager->set($payload);

    $status  = TRUE;
    $message = "usergroup added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->put("/user/group/(:id)", function($id) use ($app) {

    $payload = json_decode($app->request->getBody());

    $usergroup_manager = new UserGroup();
    $manager_response = $usergroup_manager->update($id, $payload);


    $status  = TRUE;
    $message = "group updated successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->delete("/user/group/(:id)", function ($id = "") {

    $usergroup_manager = new UserGroup();
    $manager_response = $usergroup_manager->delete($id);

    $status  = TRUE;
    $message = "group has been deleted successfully";

    $response = array(
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});
