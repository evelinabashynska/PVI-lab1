<?php

require_once __DIR__ . '/../models/StudentModel.php';

class StudentController
{
    private $studentModel;

    public function __construct()
    {
        $this->studentModel = new StudentModel();
    }

    public function listStudents(int $page = 1)
    {
        $totalStudents = $this->studentModel->getTotalStudents();
        $students = $this->studentModel->getAllStudents($page);
        $totalPages = ceil($totalStudents / $this->studentModel->getItemsPerPage());

        header('Content-Type: application/json');
        echo json_encode(['students' => $students, 'totalPages' => $totalPages, 'currentPage' => $page]);
        exit();
    }

    public function addStudent()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $group = $_POST['Group'] ?? '';
            $firstName = $_POST['firstName'] ?? '';
            $lastName = $_POST['lastName'] ?? '';
            $gender = $_POST['Gender'] ?? '';
            $birthday = $_POST['birthday'] ?? '';

            $errors = $this->validateStudentData($_POST);

            if (empty($errors)) {
                if ($this->studentModel->addStudent($_POST)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => true, 'message' => 'Студента додано']);
                    exit();
                } else {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'errors' => ['general' => 'Помилка додавання студента.']]);
                    exit();
                }
            }

            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'errors' => $errors]);
            exit();
        }
        // Обробка GET запиту, якщо потрібно показати форму окремо
    }

    public function editStudent(?int $id)
    {
        if ($id === null) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'errors' => ['general' => 'Не вказано ID студента для редагування.']]);
            exit();
        }

        $student = $this->studentModel->getStudentById($id);
        if (!$student) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'errors' => ['general' => 'Студента з таким ID не знайдено.']]);
            exit();
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $errors = $this->validateStudentData($_POST, $id);

            if (empty($errors)) {
                if ($this->studentModel->updateStudent($id, $_POST)) {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => true, 'message' => 'Дані студента оновлено']);
                    exit();
                } else {
                    header('Content-Type: application/json');
                    echo json_encode(['success' => false, 'errors' => ['general' => 'Помилка оновлення даних студента.']]);
                    exit();
                }
            }

            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'errors' => $errors]);
            exit();
        } else {
            // Обробка GET запиту для отримання даних студента для редагування
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'student' => $student]);
            exit();
        }
    }

    public function deleteStudent(?int $id)
    {
        if ($id === null) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Не вказано ID студента для видалення.']);
            exit();
        }

        if ($this->studentModel->deleteStudent($id)) {
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Студента видалено']);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Помилка видалення студента.']);
        }
        exit();
    }

    private function validateStudentData(array $data, ?int $excludeId = null): array
    {
        $errors = [];

        if (empty(trim($data['Group']))) {
            $errors['Group'] = 'Будь ласка, виберіть групу.';
        }

        if (empty(trim($data['firstName']))) {
            $errors['firstName'] = 'Ім\'я не може бути порожнім.';
        } elseif (!preg_match('/^[a-zA-Z]+$/', trim($data['firstName']))) {
            $errors['firstName'] = 'Ім\'я повинно містити лише англійські літери.';
        }

        if (empty(trim($data['lastName']))) {
            $errors['lastName'] = 'Прізвище не може бути порожнім.';
        } elseif (!preg_match('/^[a-zA-Z]+$/', trim($data['lastName']))) {
            $errors['lastName'] = 'Прізвище повинно містити лише англійські літери.';
        }

        if (empty(trim($data['Gender']))) {
            $errors['Gender'] = 'Будь ласка, виберіть стать.';
        }

        if (empty(trim($data['birthday']))) {
            $errors['birthday'] = 'Будь ласка, вкажіть дату народження.';
        } else {
            $birthdayDate = new DateTime($data['birthday']);
            $now = new DateTime();
            $age = $now->diff($birthdayDate)->y;
            if ($age < 16 || $age > 100) {
                $errors['birthday'] = 'Некоректна дата народження.';
            }
        }

        return $errors;
    }
}