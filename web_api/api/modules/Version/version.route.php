<?php

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

?>
