<?php

class Auth {

    function __construct() {}

    // Create token
    function set($user) {
        $now = new DateTime();

        $auth = R::dispense('auth');

        $auth->token = bin2hex(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM));
        $auth->ip = $_SERVER['REMOTE_ADDR'];
        $auth->user = $user;
        $auth->created = $now->format('Y-m-d H:i:s');

        R::store($auth);
        return $auth->token;
    }

    // Validate if token still valid
    function validate($token) {
        $now = new DateTime();
        // $auth = R::findOne('auth', 'ORDER BY created DESC');
        $auth = R::findOne('auth', 'token = ?', [$token]);
        $auth_list = array();

        if (count($auth)) {
            $current_time = $now->format('Y-m-d H:i:s');

            $diff_min = 12 * 60;
            $interval = abs(strtotime($current_time) - strtotime($auth->created));
            $minutes_difference = round($interval / 60);

            $is_valid = FALSE;
            if ($minutes_difference < $diff_min && $auth->ip == $_SERVER['REMOTE_ADDR']) {
                $is_valid = TRUE;
                $user_auth_modules = R::findAll("userhasauthmodules", "user_id = ?", [$auth->user->id]);
                foreach ($user_auth_modules as $module) {
                    array_push($auth_list, $module->authmodules);
                }
            }


            $response = array(
                "is_valid" => $is_valid,
                "user" => (($is_valid) ? $auth->user : ""),
                "auth" => $auth_list
            );
        } else {
            $response = array(
                "is_valid" => FALSE,
                "user" => "",
                "auth" => array()
            );
        }

        return $response;
    }

    // Get users role with token
    function getRole($token) {
        $auth = R::findOne('auth', 'token = ?', [$token]);
        return $auth->user->role;
    }
}
