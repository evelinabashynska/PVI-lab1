<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function validate_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function is_valid_name($name) {
    return preg_match("/^[a-zA-Z]+$/", $name);
}

function is_valid_date($date) {
    return strtotime($date) !== false;
}

?>