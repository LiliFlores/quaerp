<?php

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
