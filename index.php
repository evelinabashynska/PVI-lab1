<?php

session_start();

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/StudentController.php';

$authController = new AuthController();
$studentController = new StudentController();

$route = $_GET['route'] ?? '';
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? null;
$page = $_GET['page'] ?? 1;

// CORS headers for local development (adjust as needed for production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($route === 'login') {
    $authController->login();
} elseif ($route === 'logout') {
    $authController->logout();
} elseif ($route === 'students') {
    if (!$authController->isLoggedIn()) {
        http_response_code(401); // Unauthorized
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Потрібна авторизація']);
        exit();
    }

    switch ($action) {
        case 'list':
            $studentController->listStudents((int) $page);
            break;
        case 'add':
            $studentController->addStudent();
            break;
        case 'edit':
            $studentController->editStudent($id ? (int) $id : null);
            break;
        case 'delete':
            $studentController->deleteStudent($id ? (int) $id : null);
            break;
        default:
            http_response_code(400); // Bad Request
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Невідома дія для студентів']);
            exit();
    }
} else {
    // Можна перенаправляти на головну сторінку HTML або віддавати її вміст
    // Для односторінкового застосунку зазвичай нічого не робимо тут,
    // оскільки index.html вже завантажений браузером.
}