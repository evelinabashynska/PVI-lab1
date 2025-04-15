<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once '../models/Student.php';
require_once '../utils/validation.php';
//require_once './api/auth.php';

/*
// Перевірка авторизації для всіх запитів до цього файлу
if (!is_logged_in()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}
*/
// Масив студентів (для 3-ї лабораторної)
$students = [
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
    // Додайте більше студентів для тестування пагінації
];

header('Content-Type: application/json');

// 4.2) Отримання даних студентів для таблиці (асинхронний запит)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_students') {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = 5;
    $offset = ($page - 1) * $limit;
    $total_students = count($students);
    $total_pages = ceil($total_students / $limit);

    $current_students = array_slice($students, $offset, $limit);
    $students_array = array_map(function ($student) {
        return $student->toArray();
    }, $current_students);

    echo json_encode(['students' => $students_array, 'total_pages' => $total_pages, 'current_page' => $page]);
    exit();
}

// 4.3) Додавання студента
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_student') {
    $group = validate_input($_POST['group']);
    $firstName = validate_input($_POST['firstName']);
    $lastName = validate_input($_POST['lastName']);
    $gender = validate_input($_POST['gender']);
    $birthday = validate_input($_POST['birthday']);

    $errors = [];

    if (empty($group)) {
        $errors['group'] = 'Group is required.';
    }
    if (empty($firstName) || !is_valid_name($firstName)) {
        $errors['firstName'] = 'First name is required and should contain only letters.';
    }
    if (empty($lastName) || !is_valid_name($lastName)) {
        $errors['lastName'] = 'Last name is required and should contain only letters.';
    }
    if (empty($gender) || !in_array($gender, ['male', 'female'])) {
        $errors['gender'] = 'Gender is required.';
    }
    if (empty($birthday) || !is_valid_date($birthday)) {
        $errors['birthday'] = 'Birthday is required and should be a valid date (YYYY-MM-DD).';
    }

    // Перевірка на дублювання (за ім'ям та прізвищем для прикладу)
    foreach ($students as $student) {
        if ($student->firstName === $firstName && $student->lastName === $lastName) {
            $errors['duplicate'] = 'Student with this name already exists.';
            break;
        }
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        exit();
    }

    $new_student_id = count($students) + 1; // Простий спосіб генерації ID для масиву
    $new_student = new Student($new_student_id, $group, $firstName, $lastName, $gender, $birthday);
    $students[] = $new_student;

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Student added successfully', 'student' => $new_student->toArray()]);
    exit();
}

// 4.4) Редагування студента
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'edit_student' && isset($_POST['id'])) {
    $id = intval($_POST['id']);
    $group = validate_input($_POST['group']);
    $firstName = validate_input($_POST['firstName']);
    $lastName = validate_input($_POST['lastName']);
    $gender = validate_input($_POST['gender']);
    $birthday = validate_input($_POST['birthday']);

    $errors = [];

    if (empty($group)) {
        $errors['group'] = 'Group is required.';
    }
    if (empty($firstName) || !is_valid_name($firstName)) {
        $errors['firstName'] = 'First name is required and should contain only letters.';
    }
    if (empty($lastName) || !is_valid_name($lastName)) {
        $errors['lastName'] = 'Last name is required and should contain only letters.';
    }
    if (empty($gender) || !in_array($gender, ['male', 'female'])) {
        $errors['gender'] = 'Gender is required.';
    }
    if (empty($birthday) || !is_valid_date($birthday)) {
        $errors['birthday'] = 'Birthday is required and should be a valid date (YYYY-MM-DD).';
    }

    // Перевірка на дублювання (виключаючи поточного студента)
    foreach ($students as $student) {
        if ($student->id !== $id && $student->firstName === $firstName && $student->lastName === $lastName) {
            $errors['duplicate'] = 'Student with this name already exists.';
            break;
        }
    }

    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        exit();
    }

    foreach ($students as &$student) {
        if ($student->id === $id) {
            $student->group = $group;
            $student->firstName = $firstName;
            $student->lastName = $lastName;
            $student->gender = $gender;
            $student->birthday = $birthday;
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Student updated successfully', 'student' => $student->toArray()]);
            exit();
        }
    }

    http_response_code(404);
    echo json_encode(['error' => 'Student not found.']);
    exit();
}

// 4.5) Видалення студента
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_student' && isset($_POST['id'])) {
    $id_to_delete = intval($_POST['id']);
    $initial_count = count($students);
    $students = array_filter($students, function ($student) use ($id_to_delete) {
        return $student->id !== $id_to_delete;
    });

    if (count($students) < $initial_count) {
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Student deleted successfully', 'id' => $id_to_delete]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Student not found.']);
    }
    exit();
}

// Якщо жоден з оброблених випадків не підійшов
http_response_code(400);
echo json_encode(['error' => 'Invalid request.']);

?>