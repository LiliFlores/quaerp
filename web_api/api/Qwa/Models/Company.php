<?php

class Company {

    function __construct() {}

    function get($id) {

        if (empty($id)) {
            // echo "asd";
            $company = R::findAll("company");
            $company_list = array();

            if (!empty($company)) {
                foreach ($company as $current_company) {
                    // echo $company->id;
                    $groups = R::findAll("usergroup", "company_id = ?", [$current_company->id]);
                    $current_company->groups = $groups;
                    array_push($company_list, $current_company);
                }
            }
            $response = $company_list;
        } else {
            $company = R::find("company", "id = ?", [$id]);
            $response = $company;
        }

        // json_encode($response);
        // die();

        return $response;
    }

    /*
    Payload:
        {
            "id":"aidi",
            "name":"company1",
            "address":"address1",
            "city":"city1",
            "state":"state1",
            "zip":42315,
            "phone":1234567890,
            "subdirectory":"subdirectory1",
            "nofp":2,
            "df":"American",
            "hcurrency":3,
            "fdofd":"05/20/1994",
            "cfy":"2007",
            "sta":"USA"
        }
    */
    function set($payload) {

        if (empty($_FILES['file'])) {
            $filename = "default-company.png";
        } else {
            $filename = bin2hex(mcrypt_create_iv(5, MCRYPT_DEV_URANDOM)) . $_FILES['file']['name'];
            $destination = "../app/uploads/" . $filename;
            move_uploaded_file( $_FILES['file']['tmp_name'], $destination);
        }

        $now = new DateTime();

        $company = R::dispense('company');

        $company->cid = $payload->id;
        $company->name = $payload->name;
        $company->image = $filename;
        $company->address = $payload->address;
        $company->city = $payload->city;
        $company->state = $payload->state;
        $company->zip = $payload->zip;
        $company->phone = $payload->phone;
        $company->subdirectory = $payload->subdirectory;
        $company->nofp = $payload->nofp;
        $company->df = $payload->df;
        $company->hcurrency = $payload->hcurrency;
        $company->fdofd = $payload->fdofd;
        $company->cfy = $payload->cfy;
        $company->sta = $payload->sta;
        $company->created = $now->format('Y-m-d H:i:s');

        $id = R::store($company);
        return $id;
    }

    function update($company_id, $payload) {

        $status = FALSE;
        if (!empty($company_id)) {
            $company = R::findOne("company", "id = ?", [$company_id]);

            if (!empty($company)) {
                $now = new DateTime();
                // $company->cid = $payload->id;
                $company->name = $payload->name;
                // $company->image = $filename;
                $company->address = $payload->address;
                $company->city = $payload->city;
                $company->state = $payload->state;
                $company->zip = $payload->zip;
                $company->phone = $payload->phone;
                // $company->subdirectory = $payload->subdirectory;
                $company->nofp = $payload->nofp;
                $company->df = $payload->df;
                $company->hcurrency = $payload->hcurrency;
                $company->fdofd = $payload->fdofd;
                // $company->cfy = $payload->cfy;
                $company->sta = $payload->sta;
                $company->created = $now->format('Y-m-d H:i:s');

                R::store($company);
                $status = TRUE;
            }
        }

        return $status;
    }

    function delete($company_id) {
        $status = FALSE;

        if (!empty($company_id)) {
            $company = R::findOne("company", "id = ?", [$company_id]);
            if (!empty($company)) {
                R::trash($company);
                $status = TRUE;
            }
        }

        return $status;
    }

}
