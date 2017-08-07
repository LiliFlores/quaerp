<?php

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
