<?php

class VersionController {

    function __construct() {}

    function getVersion() {

        // echo getcwd();
        $api_output = shell_exec("git -C ../.git log -n 1");
        $array_api_output = explode("\n", $api_output);

        $api_response = array(
            "commit" => ltrim(str_replace("commit", "", $array_api_output[0])),
            "author" => ltrim(str_replace("Author:", "", $array_api_output[1])),
            "date" => rtrim(ltrim(str_replace("+0000", "", str_replace("Date:", "", $array_api_output[2])))),
            "description" => ltrim($array_api_output[4])
        );

        $dashboard_output = shell_exec("git -C ../../web_dashboard/.git log -n 1");
        $array_dashboard_output = explode("\n", $dashboard_output);

        $dashboard_response = array(
            "commit" => ltrim(str_replace("commit", "", $array_dashboard_output[0])),
            "author" => ltrim(str_replace("Author:", "", $array_dashboard_output[1])),
            "date" => rtrim(ltrim(str_replace("+0000", "", str_replace("Date:", "", $array_dashboard_output[2])))),
            "description" => ltrim($array_dashboard_output[4])
        );

        $response = array(
            'status' => TRUE,
            'api' => $api_response,
            'dashboard' => $dashboard_response
        );

        return $response;
    }
}

?>
