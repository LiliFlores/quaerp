<?php

$app->get("/(:entity_name)(/)(:optional+)", function($entity_name = NULL, $optional = NULL) {

    $limit_config = array(
        "limit" => 0,
        "default" => 20
    );

    $optional_len = count($optional);
    if ($optional_len >= 2) {
        if ($optional[$optional_len - 2] == "limit") {
            $limit_config["limit"] = $optional[$optional_len - 1];
            unset($optional[$optional_len - 2]);
            unset($optional[$optional_len - 1]);
        }
    }

    $status = FALSE;

    if (!empty($entity_name)) {
        $generic_manager = new GenericModel();
        $manager_response = $generic_manager->get($entity_name, $optional, $limit_config);

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

    // echo "<pre>";
    echo json_encode($response, JSON_PRETTY_PRINT);
    // echo "</pre>";
});

$app->post("/(:entity_name)(/)(:optional+)", function($entity_name = NULL) use ($app) {

    $status = FALSE;

    if (!empty($entity_name)) {
        $payload = json_decode($app->request->getBody());

        if (!is_null($payload)) {
            $generic_manager = new GenericController();
            $manager_response = $generic_manager->set($entity_name, $payload);

            if (!is_null($manager_response)) {
                $status = TRUE;
                $message = "Entity successfully added";
            } else {
                $status = FALSE;
                $message = "Please, provide a object or array";
            }
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

$app->put("/(:entity_name)(/)(:optional+)", function($entity_name = NULL) use ($app) {

    $status = FALSE;

    if (!empty($entity_name)) {
        $payload = json_decode($app->request->getBody());

        if (!is_null($payload)) {
            $generic_manager = new GenericModel();
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

$app->delete("/(:entity_name)(/)(:entity_id)(/)(:optional+)", function ($entity_name = NULL, $entity_id = NULL) {

    $status = FALSE;

    if (!empty($entity_name) && !empty($entity_id)) {
        $generic_manager = new GenericModel();
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
