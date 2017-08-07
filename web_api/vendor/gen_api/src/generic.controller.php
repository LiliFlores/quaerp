<?php

class GenericController {

    private $content_manager;

    function __construct() {
        $this->content_manager = new ContentConverter();
    }

    function get($entity, $optional, $content_type) {

        $optional = explode("/", $optional);

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

        if (!empty($entity)) {
            $model_manager = new GenericModel();
            $manager_response = $model_manager->get($entity, $optional, $limit_config);

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

        return $this->content_manager->convertArray($response, $content_type);
    }

    function create($entity, $payload, $content_type) {

        if (!empty($payload)) {
            $model_manager = new GenericModel();
            $model_response = $model_manager->create($entity, $payload);

            if ($model_response) {
                $status = TRUE;
                $message = "Entity successfully added";
            } else {
                $status = FALSE;
                $message = "Error adding entity";
            }
        } else {
            $model_response = NULL;
            $status = FALSE;
            $message = "No payload provided";
        }

        $response = array(
            "id"      => $model_response,
            "status"  => $status,
            "message" => $message
        );

        return $this->content_manager->convertArray($response, $content_type);

    }

    function update($entity, $payload, $content_type) {

        if (!empty($payload)) {
            $model_manager = new GenericModel();
            $model_response = $model_manager->update($entity, $payload);

            if ($model_response) {
                $status = TRUE;
                $message = "Entity successfully updated";
            } else {
                $status = FALSE;
                $message = "Error updating entity";
            }
        } else {
            $model_response = NULL;
            $status = FALSE;
            $message = "No payload provided";
        }

        $response = array(
            "status"  => $status,
            "message" => $message
        );

        return $this->content_manager->convertArray($response, $content_type);
    }

    function delete($entity, $entity_id, $content_type) {

        if (!empty($entity_id)) {
            $model_manager = new GenericModel();
            $model_response = $model_manager->delete($entity, $entity_id);

            if ($model_response) {
                $status = TRUE;
                $message = "Entity successfully deleted";
            } else {
                $status = FALSE;
                $message = "Error deleting entity";
            }
        } else {
            $status = FALSE;
            $message = "No ID provided";
        }

        $response = array(
            "status"  => $status,
            "message" => $message
        );

        return $this->content_manager->convertArray($response, $content_type);
    }

}
