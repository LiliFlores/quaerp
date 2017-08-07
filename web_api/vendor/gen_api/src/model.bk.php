<?php

// CRUD

class GenericModel {

    function __construct() {}

    function cleanSearchQuery($string) {
        return preg_replace('/[^A-Za-z0-9\-\:\/]/', '', $string);
    }

    function cleanString($string) {
        return preg_replace('/[^A-Za-z0-9]/', '', $string);
    }

    function cleanNumber($number) {
        return preg_replace('/[^0-9]/', '', $number);
    }

    function hasSpecialKeys($key_to_verify) {
        $special_words = array("id", "created", "updated", '$$hash_key');
        return in_array($key_to_verify, $special_words);
    }

    function get($entity_name, $optional, $limit_config) {

        $row_limit = $this->cleanNumber($limit_config["limit"]);
        $row_limit = intval($row_limit);
        if ($row_limit == 0) {
            $row_limit = $limit_config["default"];
        }

        $parameters = array();
        if (count($optional)) {
            foreach ($optional as $key => $value) {
                if (!empty($value)) {
                    array_push($parameters, $value);
                }
            }
        }

        $param_count = count($parameters);

        if ($param_count == 1) {
            $parameters = $this->cleanString($parameters[0]);
        }

        $entity_name = $this->cleanString($entity_name);

        $entity_res = array();

        if (gettype($parameters) == "array") {

            if ($param_count) {

                if ($param_count%2 != 0) {
                    unset($parameters[$param_count - 1]);
                }

                $parameters_in_groups = (array_chunk($parameters, 2));

                $condition_query = "";
                foreach ($parameters_in_groups as $key => $value) {
                    $query_format = "%s LIKE %s";

                    $entity_column = $this->cleanString($value[0]);
                    $entity_value = $this->cleanSearchQuery($value[1]);

                    if (count($parameters_in_groups) - 1 == $key) {
                        $condition_query .= sprintf($query_format, $entity_column, "'%" . $entity_value . "%'");
                    } else {
                        $condition_query .= sprintf($query_format, $entity_column, "'%" . $entity_value . "%'" . " AND ");
                    }

                    $condition_query .= sprintf('ORDER BY created DESC LIMIT %d', $row_limit);
                }

                $entity_res = array_values(R::findAll($entity_name, $condition_query));

            } else {
                $query = sprintf('SELECT * FROM %s ORDER BY created DESC LIMIT %d', $entity_name, $row_limit);
                $entity_res = R::getAll($query);
            }

        } elseif (gettype($parameters) == "string") {
            $search_response = R::findOne($entity_name, 'id = ? ORDER BY created DESC', [$parameters]);
            if (!is_null($search_response)) {
                array_push($entity_res, $search_response);
            }
        }

        if (count($entity_res)) {
            foreach ($entity_res as $key => $entity) {
                foreach ($entity as $entity_key => $key_value) {
                    if (strpos($entity_key, "_id") !== FALSE) {
                        $column_name = str_replace("_id", "", $entity_key);
                        $external_linked_entity = R::findOne($column_name, "id = ?", [$entity[$entity_key]]);

                        $entity_res[$key][$column_name] = $external_linked_entity;

                        // remove *_id object property
                        unset($entity_res[$key][$entity_key]);
                    }
                }
            }
        }

        return $entity_res;
    }

    function create($entity_name, $payload) {

        $entity_name = $this->cleanString($entity_name);

        $now = new DateTime();
        $entity = R::dispense($entity_name);

        $entity_has_array = array();

        $response = "";

        foreach ($payload as $key => $value) {

            // $value = json_encode(json_decode(json_encode($value), false));

            $key_is_special = $this->hasSpecialKeys($key);

            if (!$key_is_special) {
                if (gettype($value) == "object") {

                    $sub_entity = R::dispense($key);

                    // Sub Entity
                    $se_has_id = FALSE;
                    foreach ($value as $se_key => $se_value) {
                        if ($se_key == "id" && !$se_has_id) {
                            $se_has_id == TRUE;
                        }
                        if (gettype($se_value) == "string") {
                            $sub_entity[$se_key] = $se_value;
                        }
                    }

                    if ($se_has_id) {
                        $sub_entity = R::findOne($key, "id = ?", $value["id"]);
                    } else {
                        $sub_entity_id = R::store($sub_entity);
                        $sub_entity = R::findOne($key, "id = ?", [$sub_entity_id]);
                    }

                    $entity[$key] = $sub_entity;

                } elseif (gettype($value) == "array") {
                    if (!is_numeric($key)) {
                        $entity_has_array[$key] = $value;
                    }
                } elseif (gettype($value) == "string") {
                    $entity[$key] = $value;
                }
            }
        }

        $entity->created = $now->format("Y-m-d H:i:s");

        $entity_id = R::store($entity);
        $response = $entity_id;

        if (count($entity_has_array)) {
            foreach ($entity_has_array as $key => $entity_payload) {
                foreach ($entity_payload as $index => $payload) {
                    if (gettype($payload) == "object") {
                        $payload = json_decode(json_encode($payload), true);

                        $payload[$entity_name] = array(
                            "id" => $entity_id
                        );

                        $entity_payload[$index] = $payload;
                    }
                }
                $entity_has_array[$key] = $entity_payload;
            }

            $response = $entity_has_array;
        }

        return $response;
    }

    function update($entity_name, $payload) {

        $entity_name = $this->cleanString($entity_name);

        $status = FALSE;

        if (isset($payload->id)) {

            $now = new DateTime();
            $entity = R::findOne($entity_name, "id = ?", [$payload->id]);

            if (!empty($entity)) {
                foreach ($payload as $key => $value) {
                    if ($key != "id" && $key != "created" && $key != "updated" && $key != '$$hash_key') {
                        $entity[$key] = $value;
                    }
                }

                $entity->updated = $now->format("Y-m-d H:i:s");
                R::store($entity);

                $status = TRUE;
            }
        }

        return $status;
    }

    function delete($entity_name, $entity_id) {

        $entity_name = $this->cleanString($entity_name);
        $entity_id = $this->cleanString($entity_id);

        $status = FALSE;

        if (!empty($entity_name) && !empty($entity_id)) {
            $entity = R::findOne($entity_name, "id = ?", [$entity_id]);
            if (!empty($entity)) {
                R::trash($entity);
                $status = TRUE;
            }
        }

        return $status;
    }

}
