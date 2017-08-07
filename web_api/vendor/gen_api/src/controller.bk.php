<?php

class GenericController {

    function __construct() {}

    function set($entity_name, $payload) {

        $payload_type = gettype($payload);

        $model_manager = new GenericModel();

        $response = NULL;
        $status = FALSE;
        if ($payload_type == "object") {
            $model_response = $model_manager->create($entity_name, $payload);

            $model_response_type = gettype($model_response);
            // echo json_encode($model_response);
            if ($model_response_type == "array") {
                foreach ($model_response as $key => $value) {
                    $entity_type = gettype($model_response[$key]);
                    if ($entity_type == "array") {
                        foreach ($model_response[$key] as $sub_entity_key => $sub_entity_value) {
                            // echo "CTRL----";
                            // echo json_encode($sub_entity_value);
                            // echo "////CTRL----";
                            $sub_model_response = $model_manager->create($key, $sub_entity_value);
                        }
                    }
                }
            } elseif ($model_response_type == "integer") {
                echo "STRING!";
            }
            die();
            $response = $model_response;
        } elseif ($payload_type == "array") {
            $response = array();
            foreach ($payload as $entity) {
                $model_response = $model_manager->create($entity_name, $entity);
                array_push($response, $model_response);
            }
        }
// {
// "name": "erick1",
// "type": [
// {
// "name": "type1"
// },
// {
// "name": "type2"
// }
// ]
// }


        return $response;
    }


}
