<?php

class User {

    function __construct() {}

    function get($id) {

        if (empty($id)){
            $user_list = array();
            $users = R::findAll("user");
            if (count($users)) {
                $auth_list = array();
                foreach ($users as $current_user) {
                    $user_auth_modules = R::findAll("userhasauthmodules", "user_id = ?", [$current_user->id]);
                    if (count($user_auth_modules)) {
                        foreach ($user_auth_modules as $module) {
                            array_push($auth_list, $module->authmodules);
                        }
                        $current_user->auth_modules = $auth_list;
                        array_push($user_list, $current_user);
                    }
                }
            }
            $response = $user_list;
        } else {
            $user = R::findOne("user", "id = ?", [$id]);
            $authmodules = R::findAll("authmodules");

            $user_auth_list = array();
            if (!empty($user)) {
                if (count($authmodules)){
                    foreach ($authmodules as $current_auth_module) {
                        $user_has_auth_modules = R::findOne("userhasauthmodules", "user_id = ? AND authmodules_id = ?", [$user->id, $current_auth_module->id]);

                        if (!empty($user_has_auth_modules)) {
                            $user_module = $user_has_auth_modules->authmodules;
                            $user_module["status"] = 1;
                            array_push($user_auth_list, $user_module);
                        } else {
                            $current_auth_module["status"] = 0;
                            array_push($user_auth_list, $current_auth_module);
                        }
                    }
                }
                $user->auth_modules = $user_auth_list;
            }

            $response = $user;
        }

        return $response;
    }

    /*
    Payload:
    {
        "name": "Erick",
        "username": "ealvarez",
        "password": "password",
        "group_id": "1",
        "auth_modules": [{
            "id": "1",
            "code": "AR-01",
            "module": "AR",
            "name": "Update general1",
            "status": 0,
            "$$hashKey": "object:121"
        }, {
            "id": "2",
            "code": "AR-02",
            "module": "AR",
            "name": "Read general1",
            "status": 1,
            "$$hashKey": "object:122"
        }, {
            "id": "3",
            "code": "AR-03",
            "module": "AR",
            "name": "Update general2",
            "status": 0,
            "$$hashKey": "object:123"
        }, {
            "id": "4",
            "code": "AR-04",
            "module": "AR",
            "name": "Read general2",
            "status": 0,
            "$$hashKey": "object:124"
        }, {
            "id": "5",
            "code": "AR-05",
            "module": "AR",
            "name": "Update finance charge",
            "status": 0,
            "$$hashKey": "object:125"
        }, {
            "id": "6",
            "code": "AR-06",
            "module": "AR",
            "name": "Read finance charge",
            "status": 0,
            "$$hashKey": "object:126"
        }, {
            "id": "7",
            "code": "AR-07",
            "module": "AR",
            "name": "Update printing",
            "status": 0,
            "$$hashKey": "object:127"
        }, {
            "id": "8",
            "code": "AR-08",
            "module": "AR",
            "name": "Read printing",
            "status": 0,
            "$$hashKey": "object:128"
        }, {
            "id": "9",
            "code": "AR-09",
            "module": "AR",
            "name": "Update GL accounts",
            "status": 0,
            "$$hashKey": "object:129"
        }, {
            "id": "10",
            "code": "AR-10",
            "module": "AR",
            "name": "Read GL accounts",
            "status": 0,
            "$$hashKey": "object:130"
        }, {
            "id": "11",
            "code": "SM-01",
            "module": "SM",
            "name": "Create company",
            "status": 0,
            "$$hashKey": "object:131"
        }, {
            "id": "12",
            "code": "SM-02",
            "module": "SM",
            "name": "Create users",
            "status": 0,
            "$$hashKey": "object:132"
        }, {
            "id": "13",
            "code": "SM-03",
            "module": "SM",
            "name": "Edit users",
            "status": 0,
            "$$hashKey": "object:133"
        }, {
            "id": "14",
            "code": "SM-04",
            "module": "SM",
            "name": "Delete users",
            "status": 0,
            "$$hashKey": "object:134"
        }, {
            "id": "15",
            "code": "SM-05",
            "module": "SM",
            "name": "Create groups",
            "status": 0,
            "$$hashKey": "object:135"
        }, {
            "id": "16",
            "code": "SM-06",
            "module": "SM",
            "name": "Create groups",
            "status": 0,
            "$$hashKey": "object:136"
        }]
    }
    */
    function set($payload) {

        $now = new DateTime();

        $group = R::findOne("usergroup", "id = ?", [$payload->group_id]);
        $group_has_users = R::dispense("grouphasusers");
        $user = R::dispense('user');

        $user->name = $payload->name;
        $user->username = $payload->username;
        $user->password = $payload->password;
        $user->created = $now->format('Y-m-d H:i:s');

        $user_id = R::store($user);

        $group_has_users->usergroup = $group;
        $group_has_users->user = $user;

        R::store($group_has_users);

        foreach ($payload->auth_modules as $module) {
            if ($module->status) {
                $auth_module = R::findOne("authmodules", "id = ?", [$module->id]);
                // $_user = R::findOne("usergroup", "id = ?", [$user_id]);

                $user_has_authmodule = R::dispense("userhasauthmodules");

                $user_has_authmodule->user = $user;
                $user_has_authmodule->authmodules = $auth_module;
                R::store($user_has_authmodule);
            }
        }

        return $user_id;
    }

    /*
    Payload:
    {
        "id": "5",
        "name": "Erick",
        "username": "ealvarez",
        "password": "password",
        "group_id": "1",
        "auth_modules": [{
            "id": "1",
            "code": "AR-01",
            "module": "AR",
            "name": "Update general1",
            "status": 0,
            "$$hashKey": "object:121"
        }, {
            "id": "2",
            "code": "AR-02",
            "module": "AR",
            "name": "Read general1",
            "status": 1,
            "$$hashKey": "object:122"
        }, {
            "id": "3",
            "code": "AR-03",
            "module": "AR",
            "name": "Update general2",
            "status": 0,
            "$$hashKey": "object:123"
        }, {
            "id": "4",
            "code": "AR-04",
            "module": "AR",
            "name": "Read general2",
            "status": 1,
            "$$hashKey": "object:124"
        }, {
            "id": "5",
            "code": "AR-05",
            "module": "AR",
            "name": "Update finance charge",
            "status": 0,
            "$$hashKey": "object:125"
        }, {
            "id": "6",
            "code": "AR-06",
            "module": "AR",
            "name": "Read finance charge",
            "status": 1,
            "$$hashKey": "object:126"
        }, {
            "id": "7",
            "code": "AR-07",
            "module": "AR",
            "name": "Update printing",
            "status": 0,
            "$$hashKey": "object:127"
        }, {
            "id": "8",
            "code": "AR-08",
            "module": "AR",
            "name": "Read printing",
            "status": 0,
            "$$hashKey": "object:128"
        }, {
            "id": "9",
            "code": "AR-09",
            "module": "AR",
            "name": "Update GL accounts",
            "status": 0,
            "$$hashKey": "object:129"
        }, {
            "id": "10",
            "code": "AR-10",
            "module": "AR",
            "name": "Read GL accounts",
            "status": 0,
            "$$hashKey": "object:130"
        }, {
            "id": "11",
            "code": "SM-01",
            "module": "SM",
            "name": "Create company",
            "status": 0,
            "$$hashKey": "object:131"
        }, {
            "id": "12",
            "code": "SM-02",
            "module": "SM",
            "name": "Create users",
            "status": 0,
            "$$hashKey": "object:132"
        }, {
            "id": "13",
            "code": "SM-03",
            "module": "SM",
            "name": "Edit users",
            "status": 0,
            "$$hashKey": "object:133"
        }, {
            "id": "14",
            "code": "SM-04",
            "module": "SM",
            "name": "Delete users",
            "status": 0,
            "$$hashKey": "object:134"
        }, {
            "id": "15",
            "code": "SM-05",
            "module": "SM",
            "name": "Create groups",
            "status": 0,
            "$$hashKey": "object:135"
        }, {
            "id": "16",
            "code": "SM-06",
            "module": "SM",
            "name": "Create groups",
            "status": 0,
            "$$hashKey": "object:136"
        }]
    }
    */
    function update($user_id, $payload) {

        // $group = R::findOne("usergroup", "id = ?", [$payload->group_id]);
        $user = R::findOne('user', "id = ?", [$user_id]);

        $user->name = $payload->name;
        $user->username = $payload->username;
        $user->password = $payload->password;

        $user_id = R::store($user);

        $current_user_auth = R::findAll("userhasauthmodules", "user_id = ?", [$user->id]);
        if (count($current_user_auth)){
            foreach ($current_user_auth as $auth_module) {
                R::trash($auth_module);
            }
        }

        foreach ($payload->auth_modules as $module) {
            if ($module->status) {
                $auth_module = R::findOne("authmodules", "id = ?", [$module->id]);

                $user_has_authmodule = R::dispense("userhasauthmodules");

                $user_has_authmodule->user = $user;
                $user_has_authmodule->authmodules = $auth_module;
                R::store($user_has_authmodule);
            }
        }

        return $user_id;
    }

    /*
    Payload:
    {
        "user_id": "3"
    }
    */
    function delete($id) {
        $user = R::findOne("user", "id = ?", [$id]);
        $status = R::trash($user);
        return $status;
    }

    /*
        Payload:
        {
            "username": "ealvarez",
            "password": "password"
        }
    */
    function login($payload) {
        $user = R::findOne('user', 'username = ? AND password = ? AND active = 1', [$payload->username, $payload->password]);

        $is_valid = FALSE;
        $user_token = "";
        $message = "Usuario o contraseña incorrectos";
        if (count($user)) {
            $is_valid = TRUE;

            $auth_manager = new Auth();
            $user_token = $auth_manager->set($user);
            $message = "Ok!";
        }

        $response = array(
            'is_valid' => $is_valid,
            'token' => $user_token,
            'message' => $message
        );

        return $response;
    }

    function changeActiveState($user_id) {
        $status = FALSE;
        if (!empty($user_id)) {

            $selected_user = R::findOne("user", "id = ?", [$user_id]);
            if (!empty($selected_user)) {
                if ($selected_user->active) {
                    $selected_user->active = 0;
                } else {
                    $selected_user->active = 1;
                }

                R::store($selected_user);

                $status = TRUE;
            }
        }
        return $status;
    }

}
