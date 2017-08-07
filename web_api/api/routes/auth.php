<?php

// Verify if token is still valid
$app->get("/auth(/)(:token)", function($token = "") {

    // echo $token;
    // die();

    $auth_manager = new Auth();
    $manager_response = $auth_manager->validate($token);

    $status  = FALSE;
    $message = "No estas autorizado, inicia sesión";

    if ($manager_response["is_valid"]) {
        $status  = TRUE;
        $message = "Sesión valida";
    }

    $response = array(
        "user"    => $manager_response["user"],
        "auth"    => $manager_response["auth"],
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});
