<?php

$app->get("/ar/arfob(/)", function() {

    $arfob_manager = new ArFOB();
    $manager_response = $arfob_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/arfrgt(/)", function() {

    $arfrgt_manager = new Arfrgt();
    $manager_response = $arfrgt_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar(/)", function() {
    $general_manager = new ArGeneral2();
    $manager_response = $general_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/ar/general1(/)", function() use ($app) {
    $payload = json_decode($app->request->getBody());

    $general_manager = new ArGeneral1();
    $manager_response = $general_manager->set($payload);

    $status  = TRUE;
    $message = "argeneral1 added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});


$app->post("/ar/general2(/)", function() use ($app) {
    $payload = json_decode($app->request->getBody());

    $general_manager = new ArGeneral2();
    $manager_response = $general_manager->set($payload);

    $status  = TRUE;
    $message = "argeneral1 added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/ar/financecharge(/)", function() use ($app) {
    $payload = json_decode($app->request->getBody());

    $fc_manager = new ArFinanceCharge();
    $manager_response = $fc_manager->set($payload);

    $status  = TRUE;
    $message = "financecharge added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/ar/printing(/)", function() use ($app) {
    $payload = json_decode($app->request->getBody());

    $printing_manager = new ArPrinting();
    $manager_response = $printing_manager->set($payload);

    $status  = TRUE;
    $message = "printing added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/ar/glaccounts(/)", function() use ($app) {
    $payload = json_decode($app->request->getBody());

    $glaccounts_manager = new ArGlAccounts();
    $manager_response = $glaccounts_manager->set($payload);

    $status  = TRUE;
    $message = "glaccounts added successfully";

    $response = array(
        "id"      => $manager_response,
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/arpycd(/)", function() {

    $arfrgt_manager = new Arpycd();
    $manager_response = $arfrgt_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/arrevn(/)", function() {

    $arrevn_manager = new Arrevn();
    $manager_response = $arrevn_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/arwhse(/)", function() {

    $arwhse_manager = new Arwhse();
    $manager_response = $arwhse_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/glaccounts(/)", function() {

    $glaccounts_manager = new ArGlAccounts();
    $manager_response = $glaccounts_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/card(/)", function() {

    $card_manager = new Arcard();
    $manager_response = $card_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/adr(/)", function() {

    $adr_manager = new Arcadr();
    $manager_response = $adr_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/slpn(/)", function() {

    $slpn_manager = new Arslpn();
    $manager_response = $slpn_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/ar/irmk(/)", function() {

    $irmk_manager = new Arirmk();
    $manager_response = $irmk_manager->get();

    $status  = TRUE;
    $message = "data found";

    if (!count($manager_response)) {
        $results = array();
        $status  = FALSE;
        $message = "No data found";
    }

    $response = array(
        "results" => array_values($manager_response),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});
