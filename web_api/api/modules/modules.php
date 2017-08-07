<?php

class UserController {

    function __construct() {}

    function login($payload) {

        $model_manager = new UserModel();
        $manager_response = $model_manager->validate($payload);

        $user_token = "";
        $message = "";
        if ($manager_response["is_valid"]) {
            $auth_manager = new AuthModel();
            $user_token = $auth_manager->set($manager_response["user"]);
            $message = "Valid user";
        } else {
            $message = "User not valid";
        }

        $response = array(
            'status' => $manager_response["is_valid"],
            'token' => $user_token,
            'message' => $message
        );

        return $response;
    }
}





class UserModel {

    function __construct() {}

    function validate($payload) {

        $user = R::findOne('smuser', 'username = ? AND password = ? AND active = 1', [$payload->username, $payload->password]);

        $is_valid = FALSE;
        if (count($user)) {
            $is_valid = TRUE;
        }

        $response = array(
            "is_valid" => $is_valid,
            "user" => $user
        );

        return $response;
    }
}





new UserRoute($api);

class UserRoute {

    function __construct($api) {
        $this->loginRoute($api);
    }

    function loginRoute($api) {
        $api->post("login", function($entity, $payload, $content_type) {

            $controller_manager = new UserController();
            $manager_response = $controller_manager->login($payload);

            echo json_encode($manager_response);
        });
    }

}





class VersionController {

    function __construct() {}

    function getVersion() {

        // echo getcwd();
        $api_output = shell_exec("git -C ../.git log -n 1");
        $array_api_output = explode("\n", $api_output);

        $api_response = array(
            "commit" => ltrim(str_replace("commit", "", $array_api_output[0])),
            "author" => ltrim(str_replace("Author:", "", $array_api_output[1])),
            "date" => rtrim(ltrim(str_replace("+0000", "", str_replace("Date:", "", $array_api_output[2])))),
            "description" => ltrim($array_api_output[4])
        );

        $dashboard_output = shell_exec("git -C ../../web_dashboard/.git log -n 1");
        $array_dashboard_output = explode("\n", $dashboard_output);

        $dashboard_response = array(
            "commit" => ltrim(str_replace("commit", "", $array_dashboard_output[0])),
            "author" => ltrim(str_replace("Author:", "", $array_dashboard_output[1])),
            "date" => rtrim(ltrim(str_replace("+0000", "", str_replace("Date:", "", $array_dashboard_output[2])))),
            "description" => ltrim($array_dashboard_output[4])
        );

        $response = array(
            'status' => TRUE,
            'api' => $api_response,
            'dashboard' => $dashboard_response
        );

        return $response;
    }
}





new VersionRoute($api);

class VersionRoute {

    function __construct($api) {
        $this->versionRoute($api);
    }

    function versionRoute($api) {
        $api->get("version", function($entity, $payload, $content_type) {

            $controller_manager = new VersionController();
            $manager_response = $controller_manager->getVersion();

            echo json_encode($manager_response);
        });
    }

}





class CompanyController {

    function __construct() {}

    function createCompanyDb($db_config) {

        $database_template = "company_db_template.sql";
        $sql_file = fopen($database_template, "r");
        $database_template = fread($sql_file, filesize($database_template));
        $sql_query = str_replace("{{schema_name}}", $db_config["db_schema"], $database_template);
        fclose($sql_file);

        $model_manager = new CompanyModel();
        $manager_response = $model_manager->createDatabase($sql_query);

        return TRUE;
    }
}





class CompanyModel {

    function __construct() {}

    function createDatabase($sql_query) {
        R::exec($sql_query);
        return TRUE;
    }
}





new CompanyRoute($api);

class CompanyRoute {

    function __construct($api) {
        $this->createCompany($api);
    }

    function createCompany($api) {
        $api->post("smcompany", function($entity, $payload, $content_type) {


            $controller_manager = new GenericController();
            $manager_response = $controller_manager->create(
                $entity,
                $payload,
                $content_type
            );

            $db_config = array(
                "db_hostname" => $payload->db_hostname,
                "db_port" => $payload->db_port,
                "db_schema" => $payload->db_schema,
                "db_username" => $payload->db_username,
                "db_password" => $payload->db_password
            );

            $company_controller = new CompanyController();
            $company_response = $company_controller->createCompanyDb($db_config);

            echo $manager_response;
        });
    }

}





class AuthController {

    function __construct() {}

    // Validate user session using token
    function validate($token) {

        $token_is_valid = FALSE;
        $user = NULL;
        $message = "Token not valid";

        if (!empty($token)) {
            $auth_manager = new AuthModel();
            $auth_response = $auth_manager->validate($token);

            if ($auth_response["is_valid"]) {
                $token_is_valid = $auth_response["is_valid"];
                $user = $auth_response["user"];
                $message = "Valid user";
            }
        }

        $response = array(
            "status" => $token_is_valid,
            "user" => $user,
            "message" => $message
        );

        return $response;
    }

}





class AuthModel {

    function __construct() {}

    // Create token
    function set($user) {
        $now = new DateTime();

        $auth = R::dispense('smauth');

        $auth->token = bin2hex(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));
        $auth->ip = $_SERVER['REMOTE_ADDR'];
        $auth->smuser = $user;
        $auth->created = $now->format('Y-m-d H:i:s');

        R::store($auth);
        return $auth->token;
    }

    // Validate if token still valid
    function validate($token) {
        $now = new DateTime();
        $auth = R::findOne('smauth', 'token = ?', [$token]);

        $user = NULL;
        $is_valid = FALSE;
        if (!empty($auth)) {
            $user = $auth->smuser;
            $current_time = $now->format('Y-m-d H:i:s');

            $diff_min = 12 * 60;
            $interval = abs(strtotime($current_time) - strtotime($auth->created));
            $minutes_difference = round($interval / 60);

            if ($minutes_difference < $diff_min && $auth->ip == $_SERVER['REMOTE_ADDR']) {
                $is_valid = TRUE;
            }

        }

        $response = array(
            "is_valid" => $is_valid,
            "user" => $user
        );

        return $response;
    }

    // Get users role with token
    // function getRole($token) {
    //     $auth = R::findOne('auth', 'token = ?', [$token]);
    //     return $auth->user->role;
    // }
}



new AuthRoute($api);

class AuthRoute {

    function __construct($api) {
        $this->validateToken($api);
    }

    function validateToken($api) {
        $api->get("validatetoken", function($entity, $url_options, $content_type) {

            $token = explode("/", $url_options)[0];

            $controller_manager = new AuthController();
            $manager_response = $controller_manager->validate($token);

            echo json_encode($manager_response);
        });
    }

}


?>