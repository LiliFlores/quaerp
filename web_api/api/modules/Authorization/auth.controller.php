<?php

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

?>
