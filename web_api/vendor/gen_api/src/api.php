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

?>
