<?php

$api = new Api();

class Api {

    // Request data
    private $host;
    private $port;
    private $remote_addr;
    private $protocol;

    private $entity;
    private $uri;
    private $uri_path;
    private $uri_options;
    private $headers;
    private $payload;

    // Database data
    private $database_host;
    private $database_name;
    private $database_port;
    private $database_user;
    private $database_password;

    private $method;
    private $content_type;

    private $already_used_a_method = FALSE;

    function __construct() {

        // Request headers
        $this->headers = apache_request_headers();

        // Request Payload
        $payload = file_get_contents('php://input');
        $this->payload = json_decode($payload);

        if (is_null($this->payload)) {
            $this->payload = "";
        }

        // Request variables
        $this->host = $_SERVER["HTTP_HOST"];
        $this->uri = $_SERVER["REQUEST_URI"];
        $this->port = $_SERVER["SERVER_PORT"];
        $this->remote_addr = $_SERVER["REMOTE_ADDR"];
        $this->protocol = $_SERVER["SERVER_PORT"];
        $this->method = $_SERVER['REQUEST_METHOD'];

        $this->setUriData();

        header('Access-Control-Allow-Origin: *');

        if ($this->method == 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
            header('HTTP/1.1 200 OK');
            die();
        }
    }

    function setDatabaseData($db_host = "", $db_name = "", $db_port = "", $db_user = "", $db_password = "") {
        $this->database_host = $db_host;
        $this->database_name = $db_name;
        $this->database_port = $db_port;
        $this->database_user = $db_user;
        $this->database_password = $db_password;

        $this->checkForCustomDbConfig();
        $this->initDatabaseConnection();

        return TRUE;
    }

    function initDatabaseConnection() {
        $mysql_string = sprintf('mysql:host=%s;dbname=%s', $this->database_host, $this->database_name);
        R::setup($mysql_string, $this->database_user, $this->database_password);
    }

    function setUriData() {
        if (startsWith($this->uri, '/')) {
            $this->uri = substr($this->uri, 1);
        }

        // die($this->uri_path);

        if ($this->uri_path == '/') {
            $uri_without_path = $this->uri;
        } else {
            $uri_without_path = str_replace_first($this->uri_path, '', $this->uri);
        }

        $this->entity = explode('/', $uri_without_path)[0];
        $this->uri_options = str_replace($this->entity, '', $uri_without_path);

        if (startsWith($this->uri_options, '/')) {
            $this->uri_options = substr($this->uri_options, 1);
        }
    }

    // API Base Path
    function setUriBase($uri_path) {
        if (!endsWith($uri_path, "/")) {
            $uri_path .= '/';
        }

        $this->uri_path = $uri_path;
        $this->setUriData();
        return TRUE;
    }

    function setContentTypeHeader ($content_type = "") {

        if (empty($content_type)) {
            $content_type = "";
        }

        $ct = "";
        $ct_template = "Content-Type: %s";

        switch ($content_type) {
            case 'json':
                $ct = sprintf($ct_template, "application/json");
                $this->content_type = "json";
                break;
            case 'xml':
                $ct = sprintf($ct_template, "text/xml");
                $this->content_type = "xml";
                break;
            default:
                $ct = sprintf($ct_template, "application/json");
                $this->content_type = "json";
                break;
        }

        header($ct);
    }

    function checkForCustomDbConfig() {
        foreach ($this->headers as $key => $value) {
            $key = strtolower($key);
            switch ($key) {
                case 'db-host':
                    $this->database_host = $value;
                    break;
                case 'db-name':
                    $this->database_name = $value;
                    break;
                case 'db-port':
                    $this->database_port = $value;
                    break;
                case 'db-user':
                    $this->database_user = $value;
                    break;
                case 'db-password':
                    $this->database_password = $value;
                    break;
            }
        }
    }

    function get($input_entity_or_callback, $callback = "") {
        if (!$this->already_used_a_method) {

            if ($this->method == 'GET') {
                $this->setContentTypeHeader();

                if (gettype($input_entity_or_callback) == "string") {
                    if ($input_entity_or_callback == $this->entity) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $this->uri_options, $this->content_type);
                    }

                    if (empty($input_entity_or_callback)) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $this->uri_options, $this->content_type);
                    }
                } elseif (gettype($input_entity_or_callback) == "object") {
                    $this->already_used_a_method = TRUE;

                    return $input_entity_or_callback($this->entity, $this->uri_options, $this->content_type);
                }

            }

        }
    }

    function post($input_entity_or_callback, $callback = "") {
        if (!$this->already_used_a_method) {

            if ($this->method == 'POST') {
                $this->setContentTypeHeader();

                if (gettype($input_entity_or_callback) == "string") {
                    if ($input_entity_or_callback == $this->entity) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $this->payload, $this->content_type);
                    }

                    if (empty($input_entity_or_callback)) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $this->payload, $this->content_type);
                    }
                } elseif (gettype($input_entity_or_callback) == "object") {
                    $this->already_used_a_method = TRUE;

                    return $input_entity_or_callback($this->entity, $this->payload, $this->content_type);
                }

            }

        }
    }

    function put($input_entity_or_callback, $callback = "") {
        if (!$this->already_used_a_method) {

            if ($this->method == 'PUT') {
                $this->setContentTypeHeader();

                if (gettype($input_entity_or_callback) == "string") {
                    if ($input_entity_or_callback == $this->entity) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $this->payload, $this->content_type);
                    }

                    if (empty($input_entity_or_callback)) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $this->payload, $this->content_type);
                    }
                } elseif (gettype($input_entity_or_callback) == "object") {
                    $this->already_used_a_method = TRUE;

                    return $input_entity_or_callback($this->entity, $this->payload, $this->content_type);
                }

            }

        }
    }

    function delete($input_entity_or_callback, $callback = "") {
        if (!$this->already_used_a_method) {

            if ($this->method == 'DELETE') {
                $this->setContentTypeHeader();

                $entity_id = "";
                $divided_uri = explode("/", $this->uri_options);
                if (!empty($divided_uri[0])) {
                    $entity_id = $divided_uri[0];
                }

                if (gettype($input_entity_or_callback) == "string") {
                    if ($input_entity_or_callback == $this->entity) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $entity_id, $this->content_type);
                    }

                    if (empty($input_entity_or_callback)) {
                        $this->already_used_a_method = TRUE;

                        return $callback($this->entity, $entity_id, $this->content_type);
                    }
                } elseif (gettype($input_entity_or_callback) == "object") {
                    $this->already_used_a_method = TRUE;

                    return $input_entity_or_callback($this->entity, $entity_id, $this->content_type);
                }

            }

        }
    }

    function setGenericCRUD() {
        $this->get(function($entity, $uri_options, $content_type) {
            $controller_manager = new GenericController();
            $manager_response = $controller_manager->get(
                $entity,
                $uri_options,
                $content_type
            );

            echo $manager_response;
        });

        $this->post(function($entity, $payload, $content_type) {
            $controller_manager = new GenericController();
            $manager_response = $controller_manager->create(
                $entity,
                $payload,
                $content_type
            );

            echo $manager_response;
        });

        $this->put(function($entity, $payload, $content_type) {
            $controller_manager = new GenericController();
            $manager_response = $controller_manager->update(
                $entity,
                $payload,
                $content_type
            );

            echo $manager_response;
        });

        $this->delete(function($entity, $entity_id, $content_type) {
            $controller_manager = new GenericController();
            $manager_response = $controller_manager->delete(
                $entity,
                $entity_id,
                $content_type
            );

            echo $manager_response;
        });
    }

}





    class ContentConverter {

        function __construct() {}

        function convertArray($array_to_convert, $content_type = "") {

            $converted_array;
            switch ($content_type) {
                case 'json':
                    $converted_array = json_encode($array_to_convert);
                    break;
                case 'xml':
                    // TODO
                    // $xml = new SimpleXMLElement('<rootTag/>');
                    // $this->to_xml($xml, $array_to_convert);
                    //
                    // print $xml->asXML();
                    // die();
                    break;
                default:
                    $converted_array = json_encode($array_to_convert);
                    break;
            }

            return $converted_array;
        }

        function to_xml(SimpleXMLElement $object, array $data) {
            foreach ($data as $key => $value) {
                if (is_array($value)) {
                    $new_object = $object->addChild($key);
                    $this->to_xml($new_object, $value);
                } else {
                    $object->addChild($key, $value);
                }
            }
        }

    }





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
        if (is_numeric($number)) {
            $number = intval($number);
        } else {
            $number = 0;
        }

        return $number;
    }

    function hasSpecialKeys($key_to_verify) {
        $special_words = array("id", "created", "updated", '$$hash_key');
        return in_array($key_to_verify, $special_words);
    }

    function get($entity_name, $optional, $limit_config) {
        
        $row_limit = $this->cleanNumber($limit_config["limit"]);
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
                }
                
                if ($row_limit > 0) {
                    $condition_query .= sprintf('ORDER BY created DESC LIMIT %d', $row_limit);
                } else {
                    $condition_query .= sprintf('ORDER BY created DESC');
                }

                $entity_res = array_values(R::findAll($entity_name, $condition_query));

            } else {
                
                if ($row_limit > 0) {
                    $query = sprintf('SELECT * FROM %s ORDER BY created DESC LIMIT %d', $entity_name, $row_limit);
                } else {
                    $query = sprintf('SELECT * FROM %s ORDER BY created DESC', $entity_name);
                }
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

            $key_is_special = $this->hasSpecialKeys($key);

            if (!$key_is_special) {

                if (gettype($value) == "object") {

                    $sub_entity = R::dispense($key);

                    // Sub Entity
                    $se_has_id = FALSE;
                    foreach ($value as $se_key => $se_value) {
                        if ($se_key == "id" && !$se_has_id) {
                            $se_has_id = TRUE;
                        }
                        if (gettype($se_value) == "string") {
                            $sub_entity[$se_key] = $se_value;
                        }
                    }

                    if ($se_has_id) {
                        $sub_entity = R::findOne($key, "id = ?", [$value->id]);
                    } else {
                        $sub_entity_id = R::store($sub_entity);
                        $sub_entity = R::findOne($key, "id = ?", [$sub_entity_id]);
                    }

                    $entity[$key] = $sub_entity;

                } elseif (gettype($value) == "string") {
                    $entity[$key] = $value;
                } elseif (gettype($value) == "integer") {
                    $entity[$key] = $value;
                } elseif (gettype($value) == "double") {
                    $entity[$key] = $value;
                } elseif (gettype($value) == "boolean") {
                    $entity[$key] = $value;
                }

            }
        }

        $entity->created = $now->format("Y-m-d H:i:s");

        try {
            $entity_id = R::store($entity);
            $response = $entity_id;
        } catch (Exception $e) {
            $response = FALSE;
        }

        return $response;
    }

    function update($entity_name, $payload) {

        $entity = $this->cleanString($entity_name);
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

        $entity = $this->cleanString($entity_name);
        $entity_id = $this->cleanString($entity_id);
        $status = FALSE;

        $entity = R::findOne($entity, "id = ?", [$entity_id]);
        if (!empty($entity)) {
            R::trash($entity);
            $status = TRUE;
        }

        return $status;
    }


}



// String functions

// http://stackoverflow.com/questions/834303/startswith-and-endswith-functions-in-php
function startsWith($haystack, $needle) {
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function str_replace_first($from, $to, $subject) {
    $from = '/'.preg_quote($from, '/').'/';
    return preg_replace($from, $to, $subject, 1);
}

?>