<?php

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

?>
