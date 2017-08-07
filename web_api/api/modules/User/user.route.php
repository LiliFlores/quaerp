<?php

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

?>
