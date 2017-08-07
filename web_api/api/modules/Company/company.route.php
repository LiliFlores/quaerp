<?php

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

?>
