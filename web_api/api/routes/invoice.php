<?php

$app->get("/invoice(/)(:id)", function($id = "") {

    $invoice_manager = new ArInvoice();
    $manager_response = $invoice_manager->get($id);

    $status  = TRUE;
    $message = "data found";

    $invoice_response = [];
    if ($manager_response["type"]) {
        $invoice_response = $manager_response["invoice"];
        if ($invoice_response == null) {
            $invoice_response = array();
            $status  = FALSE;
            $message = "No data found";
        }
    } else {
        $invoice_response = array_values($manager_response["invoice"]);
        if (!count($invoice_response)) {
            $invoice_response = array();
            $status  = FALSE;
            $message = "No data found";
        }
    }

    $response = array(
        "results" => array(
            "invoice" => $invoice_response,
            "item" => array_values($manager_response["item"])
        ),
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});

$app->post("/invoice(/)", function() use ($app) {
    $payload = json_decode($app->request->getBody());

    $invoice_manager = new ArInvoice();
    $manager_response = $invoice_manager->set($payload);

    // $status  = TRUE;
    if ($manager_response) {
        $message = "invoice added successfully";
    } else {
        $message = "error adding invoice";
    }

    $response = array(
        "status"  => $manager_response,
        "message" => $message
    );

    echo json_encode($response);
});

$app->put("/invoice/(:id)", function($id = "") use ($app) {

    $payload = json_decode($app->request->getBody());

    $invoice_manager = new ArInvoice();
    $manager_response = $invoice_manager->update($id, $payload);

    if ($manager_response) {
        $message = "invoice updated successfully";
    } else {
        $message = "error";
    }

    $response = array(
        "status"  => $manager_response,
        "message" => $message
    );

    echo json_encode($response);
});

$app->get("/invoice/disable/(:id)", function($id = "") {

    $invoice_manager = new ArInvoice();
    $manager_response = $invoice_manager->disable($id);

    $status  = TRUE;
    $message = "invoice disabled successfully";

    $response = array(
        "status"  => $status,
        "message" => $message
    );

    echo json_encode($response);
});
//
// $app->delete("/invoice/(:id)", function ($id = "") {
//
//     $invoice_manager = new ArInvoice();
//     $manager_response = $invoice_manager->delete($id);
//
//     if ($manager_response) {
//         $message = "invoice deleted successfully";
//     } else {
//         $message = "error";
//     }
//
//     $response = array(
//         "status"  => $manager_response,
//         "message" => $message
//     );
//
//     echo json_encode($response);
// });
