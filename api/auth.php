<?php
// Встановлення відображення помилок
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Запуск сесії
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Підключення необхідних файлів
require_once '../models/Student.php';
require_once '../utils/validation.php';

// Масив студентів для автентифікації
$students_data = [
    new Student(1, 'PZ-11', 'John', 'Smith', 'male', '2004-05-11'),
    new Student(2, 'PZ-12', 'Ann', 'Bond', 'female', '2004-04-24'),
    new Student(3, 'PZ-11', 'Peter', 'Jones', 'male', '2003-12-01'),
    new Student(4, 'PZ-13', 'Alice', 'Brown', 'female', '2005-07-15'),
    new Student(5, 'PZ-12', 'David', 'Miller', 'male', '2004-01-20'),
    new Student(6, 'PZ-14', 'Emily', 'Wilson', 'female', '2003-09-05'),
    new Student(7, 'PZ-11', 'Michael', 'Moore', 'male', '2004-11-30'),
    new Student(8, 'PZ-15', 'Sophia', 'Taylor', 'female', '2005-03-10'),
    new Student(9, 'PZ-13', 'Daniel', 'Clark', 'male', '2003-06-22'),
    new Student(10, 'PZ-16', 'Olivia', 'Lewis', 'female', '2004-08-18'),
];

// Перевірка, чи користувач залогінений
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

// Отримання інформації про залогіненого користувача
function get_logged_in_user() {
    if (is_logged_in()) {
        global $students_data;
        foreach ($students_data as $student) {
            if ($student->id === $_SESSION['user_id']) {
                return $student->toArray();
            }
        }
    }
    return null;
}

// Встановлення заголовка Content-Type перед будь-яким виводом
header('Content-Type: application/json');

// Обробка POST запиту для логіна
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Спробуємо спочатку обробити JSON вхідні дані
    $input_data = json_decode(file_get_contents('php://input'), true);
    
    // Перевірка, чи ми отримали дані як JSON
    if (json_last_error() === JSON_ERROR_NONE && isset($input_data['login']) && isset($input_data['password'])) {
        $login = validate_input($input_data['login']);
        $password = validate_input($input_data['password']);
    } 
    // Якщо не JSON, перевіряємо звичайний POST
    elseif (isset($_POST['login']) && isset($_POST['password'])) {
        $login = validate_input($_POST['login']);
        $password = validate_input($_POST['password']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing login credentials.']);
        exit();
    }
    
    foreach ($students_data as $student) {
        // Автентифікація: логін - ім'я, пароль - дата народження (YYYY-MM-DD)
        if ($student->firstName === $login && $student->birthday === $password) {
            $_SESSION['user_id'] = $student->id;
            $_SESSION['username'] = $student->firstName . ' ' . $student->lastName;
            echo json_encode(['success' => true, 'message' => 'Successfully logged in.', 'user' => $student->toArray()]);
            exit();
        }
    }
    
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid login credentials.']);
    exit();
}

// Обробка GET запиту для виходу
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['logout'])) {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Successfully logged out.']);
    exit();
}

// Обробка GET запиту для перевірки статусу автентифікації
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'check_auth') {
    $isLoggedIn = is_logged_in();
    $user = get_logged_in_user();
    
    echo json_encode(['isLoggedIn' => $isLoggedIn, 'user' => $user]);
    exit();
}

// Якщо жоден з оброблених випадків не підійшов
http_response_code(400);
echo json_encode(['error' => 'Invalid request to auth.php']);
?>