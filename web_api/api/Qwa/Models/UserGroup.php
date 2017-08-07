<?php

class UserGroup {

    function __construct() {}

    function get($company_id) {

        if (empty($company_id)) {
            $usergroup = R::findAll("usergroup");
        } else {
            $usergroup = R::findAll("usergroup", "company_id = ?", [$company_id]);
        }

        $authmodules = R::findAll("authmodules");
        $group_has_users = R::findAll("grouphasusers");

        $group_list = array();
        foreach ($usergroup as $group) {
            $group_user_list = array();
            $group_auth_list = array();
            foreach ($authmodules as $current_auth_module) {
                $group_has_auth_modules = R::findOne("grouphasauthmodules", "usergroup_id = ? AND authmodules_id = ?", [$group->id, $current_auth_module->id]);

                if (!empty($group_has_auth_modules)) {
                    $groups_module = $group_has_auth_modules->authmodules;
                    $groups_module["status"] = 1;
                    array_push($group_auth_list, $groups_module);
                } else {
                    $current_auth_module["status"] = 0;
                    array_push($group_auth_list, $current_auth_module);
                }
            }

            foreach ($group_has_users as $record) {
                // echo $record->user_id;
                if ($record->usergroup->id == $group->id) {
                    $current_user = $record->user;

                    $auth_list = array();
                    if (!empty($current_user->id)) {
                        $user_auth_modules = R::findAll("userhasauthmodules", "user_id = ?", [$current_user->id]);
                        if (count($user_auth_modules)) {
                            foreach ($user_auth_modules as $module) {
                                array_push($auth_list, $module->authmodules);
                            }
                            $current_user->auth_modules = $auth_list;
                        }
                    }

                    array_push($group_user_list, $current_user);
                }
            }

            $group->modules = $group_auth_list;
            $group->users = $group_user_list;
            array_push($group_list, $group);
        }
        // die();
        // die();
        // die();
        return $group_list;
    }

/*
    Payload:
    {
        "name": "group1",
        "day_sun": true,
        "day_mon": false,
        "day_tue": true,
        "day_wed": false,
        "day_thu": true,
        "day_fri": false,
        "day_sat": true,
        "login_start": "12:00",
        "login_end": "18:00",
        "accessmodules": [
            {
                "id": "1",
                "code": "AR-01",
                "module": "AR",
                "name": "Update general1",
                "selected": true,
                "$$hashKey": "object:26"
            },
            {
                "id": "2",
                "code": "AR-02",
                "module": "AR",
                "name": "Read general1",
                "selected": true,
                "$$hashKey": "object:27"
            },
            {
                "id": "3",
                "code": "AR-03",
                "module": "AR",
                "name": "Update general2",
                "selected": true,
                "$$hashKey": "object:28"
            },
            {
                "id": "4",
                "code": "AR-04",
                "module": "AR",
                "name": "Read general2",
                "selected": true,
                "$$hashKey": "object:29"
            },
            {
                "id": "5",
                "code": "AR-05",
                "module": "AR",
                "name": "Update finance charge",
                "selected": true,
                "$$hashKey": "object:30"
            },
            {
                "id": "6",
                "code": "AR-06",
                "module": "AR",
                "name": "Read finance charge",
                "selected": false,
                "$$hashKey": "object:31"
            },
            {
                "id": "7",
                "code": "AR-07",
                "module": "AR",
                "name": "Update printing",
                "selected": false,
                "$$hashKey": "object:32"
            },
            {
                "id": "8",
                "code": "AR-08",
                "module": "AR",
                "name": "Read printing",
                "selected": false,
                "$$hashKey": "object:33"
            },
            {
                "id": "9",
                "code": "AR-09",
                "module": "AR",
                "name": "Update GL accounts",
                "selected": false,
                "$$hashKey": "object:34"
            },
            {
                "id": "10",
                "code": "AR-10",
                "module": "AR",
                "name": "Read GL accounts",
                "selected": false,
                "$$hashKey": "object:35"
            },
            {
                "id": "11",
                "code": "SM-01",
                "module": "SM",
                "name": "Create company",
                "selected": false,
                "$$hashKey": "object:36"
            },
            {
                "id": "12",
                "code": "SM-02",
                "module": "SM",
                "name": "Create users",
                "selected": false,
                "$$hashKey": "object:37"
            },
            {
                "id": "13",
                "code": "SM-03",
                "module": "SM",
                "name": "Edit users",
                "selected": false,
                "$$hashKey": "object:38"
            },
            {
                "id": "14",
                "code": "SM-04",
                "module": "SM",
                "name": "Delete users",
                "selected": false,
                "$$hashKey": "object:39"
            },
            {
                "id": "15",
                "code": "SM-05",
                "module": "SM",
                "name": "Create groups",
                "selected": false,
                "$$hashKey": "object:40"
            },
            {
                "id": "16",
                "code": "SM-06",
                "module": "SM",
                "name": "Create groups",
                "selected": false,
                "$$hashKey": "object:41"
            }
        ]
    }
*/
    function set($payload) {
        $now = new DateTime();

        $usergroup = R::dispense('usergroup');

        $usergroup->name = $payload->name;
        $usergroup->day_sun = $payload->day_sun;
        $usergroup->day_mon = $payload->day_mon;
        $usergroup->day_tue = $payload->day_tue;
        $usergroup->day_wed = $payload->day_wed;
        $usergroup->day_thu = $payload->day_thu;
        $usergroup->day_fri = $payload->day_fri;
        $usergroup->day_sat = $payload->day_sat;
        $usergroup->login_start = $payload->login_start;
        $usergroup->login_end = $payload->login_end;
        $usergroup->company = R::findOne("company", "id = ?", [$payload->company_id]);
        $usergroup->created = $now->format('Y-m-d H:i:s');

        $id = R::store($usergroup);

        foreach ($payload->accessmodules as $module) {
            if ($module->selected) {
                $auth_module = R::findOne("authmodules", "id = ?", [$module->id]);
                $user_group = R::findOne("usergroup", "id = ?", [$id]);

                $group_has_authmodule = R::dispense("grouphasauthmodules");

                $group_has_authmodule->usergroup = $user_group;
                $group_has_authmodule->authmodules = $auth_module;
                R::store($group_has_authmodule);
            }
        }

        return $id;
    }

    /*
        Payload:
        {
            "id": "1",
            "name": "Admins",
            "day_sun": "1",
            "day_mon": "0",
            "day_tue": "1",
            "day_wed": "0",
            "day_thu": "1",
            "day_fri": "0",
            "day_sat": "1",
            "login_start": "12:00",
            "login_end": "18:00",
            "created": "2016-10-20 01:00:20",
            "company_id": "3",
            "modules": [{
                "id": "2",
                "code": "AR-02",
                "module": "AR",
                "name": "General1",
                "status": 1,
                "$$hashKey": "object:122"
            }, {
                "id": "4",
                "code": "AR-04",
                "module": "AR",
                "name": "General2",
                "status": 1,
                "$$hashKey": "object:123"
            }, {
                "id": "6",
                "code": "AR-06",
                "module": "AR",
                "name": "Finance charge",
                "status": 1,
                "$$hashKey": "object:124"
            }, {
                "id": "8",
                "code": "AR-08",
                "module": "AR",
                "name": "Printing",
                "status": 1,
                "$$hashKey": "object:125"
            }, {
                "id": "10",
                "code": "AR-10",
                "module": "AR",
                "name": "GL accounts",
                "status": 1,
                "$$hashKey": "object:126"
            }, {
                "id": "11",
                "code": "SM-01",
                "module": "SM",
                "name": "Create company",
                "status": 1,
                "$$hashKey": "object:127"
            }, {
                "id": "12",
                "code": "SM-02",
                "module": "SM",
                "name": "Create users",
                "status": 1,
                "$$hashKey": "object:128"
            }, {
                "id": "13",
                "code": "SM-03",
                "module": "SM",
                "name": "Edit users",
                "status": 1,
                "$$hashKey": "object:129"
            }, {
                "id": "14",
                "code": "SM-04",
                "module": "SM",
                "name": "Delete users",
                "status": 1,
                "$$hashKey": "object:130"
            }, {
                "id": "15",
                "code": "SM-05",
                "module": "SM",
                "name": "Create groups",
                "status": 1,
                "$$hashKey": "object:131"
            }],
            "users": [{
                "id": "1",
                "name": "Erick",
                "username": "ealvarez",
                "password": "password",
                "created": "2016-10-20 01:00:38",
                "auth_modules": [{
                    "id": "2",
                    "code": "AR-02",
                    "module": "AR",
                    "name": "General1"
                }, {
                    "id": "4",
                    "code": "AR-04",
                    "module": "AR",
                    "name": "General2"
                }, {
                    "id": "6",
                    "code": "AR-06",
                    "module": "AR",
                    "name": "Finance charge"
                }, {
                    "id": "8",
                    "code": "AR-08",
                    "module": "AR",
                    "name": "Printing"
                }, {
                    "id": "10",
                    "code": "AR-10",
                    "module": "AR",
                    "name": "GL accounts"
                }, {
                    "id": "11",
                    "code": "SM-01",
                    "module": "SM",
                    "name": "Create company"
                }, {
                    "id": "12",
                    "code": "SM-02",
                    "module": "SM",
                    "name": "Create users"
                }, {
                    "id": "13",
                    "code": "SM-03",
                    "module": "SM",
                    "name": "Edit users"
                }, {
                    "id": "14",
                    "code": "SM-04",
                    "module": "SM",
                    "name": "Delete users"
                }, {
                    "id": "15",
                    "code": "SM-05",
                    "module": "SM",
                    "name": "Create groups"
                }, {
                    "id": 0
                }]
            }],
            "$$hashKey": "object:118"
        }
    */
    function update($usergroup_id, $payload) {

        $usergroup = R::findOne('usergroup', "id = ?", [$usergroup_id]);

        $usergroup->name = $payload->name;
        $usergroup->day_sun = $payload->day_sun;
        $usergroup->day_mon = $payload->day_mon;
        $usergroup->day_tue = $payload->day_tue;
        $usergroup->day_wed = $payload->day_wed;
        $usergroup->day_thu = $payload->day_thu;
        $usergroup->day_fri = $payload->day_fri;
        $usergroup->day_sat = $payload->day_sat;
        $usergroup->login_start = $payload->login_start;
        $usergroup->login_end = $payload->login_end;

        $group_id = R::store($usergroup);

        $current_group_auth = R::findAll("grouphasauthmodules", "usergroup_id = ?", [$usergroup->id]);
        if (count($current_group_auth)) {
            foreach ($current_group_auth as $auth_module) {
                R::trash($auth_module);
            }
        }

        foreach ($payload->modules as $module) {
            if ($module->status) {
                $auth_module = R::findOne("authmodules", "id = ?", [$module->id]);
                $user_group = R::findOne("usergroup", "id = ?", [$usergroup->id]);

                $group_has_authmodule = R::dispense("grouphasauthmodules");

                $group_has_authmodule->usergroup = $user_group;
                $group_has_authmodule->authmodules = $auth_module;
                R::store($group_has_authmodule);
            }
        }

        return $group_id;
    }

    function delete($id) {
        $usergroup = R::findOne("usergroup", "id = ?", [$id]);
        $status = FALSE;
        if (!empty($usergroup)){
            $status = R::trash($usergroup);
        }
        return $status;
    }

}
