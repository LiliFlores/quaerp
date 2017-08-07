<?php

class Generic {

    function __construct() {}

    function cleanString($string) {
        return preg_replace('/[^A-Za-z0-9\-]/', '', $string);
    }

    function get($entity_name, $entity_id_column, $search_query) {
        // $entity_id_column: entity ID or entity table Column

        $entity_name = $this->cleanString($entity_name);
        $entity_id_column = $this->cleanString($entity_id_column);
        $search_query = $this->cleanString($search_query);

        if (empty($search_query)) {
            if (empty($entity_id_column)) {
                // Get all entities without filters

                $entity_res = array_values(R::findAll($entity_name));
            } else {
                // Get entity by ID

                $entity_res = array();
                $search_response = R::findOne($entity_name, "id = ?", [$entity_id_column]);
                if (!is_null($search_response)) {
                    array_push($entity_res, $search_response);
                }
            }
        } else {
            // Do search by column

            $search_query = "%" . $search_query . "%";
            $entity_res = array_values(R::findAll($entity_name, "$entity_id_column LIKE ?", [$search_query]));
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

    function set($entity_name, $payload) {

        $entity_name = $this->cleanString($entity_name);

        $now = new DateTime();
        $entity = R::dispense($entity_name);

        foreach ($payload as $key => $value) {
            if ($key != "id" && $key != "created" && $key != "updated") {
                if (gettype($value) == "object") {

                    // TODO: registrar entidades multinivel (no solo el 2ndo)
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

                } else {
                    $entity[$key] = $value;
                }
            }
        }

        $entity->created = $now->format("Y-m-d H:i:s");

        $entity_id = R::store($entity);
        return $entity_id;
    }

    function update($entity_name, $payload) {

        $entity_name = $this->cleanString($entity_name);

        $status = FALSE;

        if (isset($payload->id)) {

            $now = new DateTime();
            $entity = R::findOne($entity_name, "id = ?", [$payload->id]);

            if (!empty($entity)) {
                foreach ($payload as $key => $value) {
                    if ($key != "id" && $key != "created" && $key != "updated") {
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
