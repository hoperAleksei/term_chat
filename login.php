<?php

$users = array(
    ["login" => "root", "passwd" => "toor"],
    ["login" => "admin", "passwd" => "password"],
    ["login" => "12345", "passwd" => "12345"],
    ["login" => "DevOps", "passwd" => "Sasha"],
);

$ok_auth = json_encode(["state" => "ok"]);
$er_auth = json_encode(["state" => "er"]);

$file = "messages.json";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data)) {
    http_response_code(400);
    return;
} else {
    header("Content-Type: application/json");
    if ($data["method"] == "login") {
        if (in_array(["login" => $data["login"], "passwd" => $data["passwd"]], $users)) {
            echo $ok_auth;
            setcookie("login", $data["login"]);
        } else {
            echo $er_auth;
        }
        return;
    } elseif ($data["method"] == "say") {
        if (file_exists($file)) {
            $messages = json_decode(file_get_contents($file), true);
        } else {
            $messages = array();
        }
        $messages[] = ["login" => $data["login"], "message" => $data["message"]];

        echo json_encode(["login" => $data["login"], "message" => $data["message"]]);

        file_put_contents($file, json_encode($messages));

        return;

    } elseif ($data["method"] == "view") {
        if (file_exists($file)) {
            $messages = file_get_contents($file);
        } else {
            $messages = array();
        }

        echo $messages;
        return;

    }
}
