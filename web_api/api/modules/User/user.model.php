<?php

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

?>
