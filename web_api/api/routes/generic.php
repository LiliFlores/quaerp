<?php

$app->get("/generic/(:entity_name)(/)(:entity_id_column)(/)(:search_query)(/)", function($entity_name = NULL, $entity_id_column = NULL, $search_query = NULL) {
    // $entity_id_column: entity ID or entity table Column

    $status = FALSE;

    if (!empty($entity_name)) {
        $generic_manager = new Generic();
        $manager_response = $generic_manager->get($entity_name, $entity_id_column, $search_query);

        $results = $manager_response;

        if (empty($manager_response)) {
            $message = "Entity not found";
        } else {
            $status = TRUE;
            $message = "Entity found";
        }

    } else {
        $message = "No entity provided";
        $results = array();
    }

    $response = array(
        "results" => $results,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/generic/(:entity_name)(/)(:optional)", function($entity_name = NULL) use ($app) {

    $status = FALSE;

    if (!empty($entity_name)) {
        $payload = json_decode($app->request->getBody());

        if (!is_null($payload)) {
            $generic_manager = new Generic();
            $manager_response = $generic_manager->set($entity_name, $payload);

            $status = TRUE;
            $message = "Entity successfully added";
        } else {
            $message = "No payload provided";
            $manager_response = NULL;
        }

    } else {
        $message = "No entity provided";
        $manager_response = NULL;
    }

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->put("/generic/(:entity_name)(/)(:optional)", function($entity_name = NULL) use ($app) {

    $status = FALSE;

    if (!empty($entity_name)) {
        $payload = json_decode($app->request->getBody());

        if (!is_null($payload)) {
            $generic_manager = new Generic();
            $manager_response = $generic_manager->update($entity_name, $payload);

            if ($manager_response) {
                $message = "Entity successfully updated";
                $status = TRUE;
            } else {
                $message = "Error updating the entity";
            }

        } else {
            $message = "No payload provided";
        }

    } else {
        $message = "No entity provided";
    }

    $response = array(
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->delete("/generic/(:entity_name)(/)(:entity_id)(/)", function ($entity_name = NULL, $entity_id = NULL) {

    $status = FALSE;

    if (!empty($entity_name) && !empty($entity_id)) {
        $generic_manager = new Generic();
        $manager_response = $generic_manager->delete($entity_name, $entity_id);

        if ($manager_response) {
            $status = TRUE;
            $message = "Entity successfully deleted";
        } else {
            $message = "Error deleting entity";
        }

    } else {
        $message = "No entity or ID provided";
    }

    $response = array(
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});
