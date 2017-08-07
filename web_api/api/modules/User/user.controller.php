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

?>
