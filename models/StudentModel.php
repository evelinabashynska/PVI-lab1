<?php

class StudentModel
{
    private $db;
    private $itemsPerPage = 5; // Кількість студентів на сторінці за замовчуванням

    public function __construct()
    {
        $config = require __DIR__ . '/../config/database.php';
        try {
            $this->db = new PDO("mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8", $config['user'], $config['password']);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die("Помилка підключення до бази даних: " . $e->getMessage());
        }
    }

    public function getAllStudents(int $page = 1): array
    {
        $offset = ($page - 1) * $this->itemsPerPage;
        $stmt = $this->db->prepare("SELECT id, `Group`, firstName, lastName, Gender, Birthday FROM students LIMIT :limit OFFSET :offset");
        $stmt->bindParam(':limit', $this->itemsPerPage, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getTotalStudents(): int
    {
        $stmt = $this->db->query("SELECT COUNT(*) FROM students");
        return $stmt->fetchColumn();
    }

    public function getStudentById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT id, `Group`, firstName, lastName, Gender, Birthday FROM students WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function addStudent(array $data): ?int
    {
        $stmt = $this->db->prepare("INSERT INTO students (`Group`, firstName, lastName, Gender, Birthday) VALUES (:group, :firstName, :lastName, :gender, :birthday)");
        $stmt->bindParam(':group', $data['Group']);
        $stmt->bindParam(':firstName', $data['firstName']);
        $stmt->bindParam(':lastName', $data['lastName']);
        $stmt->bindParam(':gender', $data['gender']);
        $stmt->bindParam(':birthday', $data['birthday']);

        if ($stmt->execute()) {
            return $this->db->lastInsertId();
        }
        return null;
    }

    public function updateStudent(int $id, array $data): bool
    {
        $stmt = $this->db->prepare("UPDATE students SET `Group` = :group, firstName = :firstName, lastName = :lastName, Gender = :gender, Birthday = :birthday WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':group', $data['Group']);
        $stmt->bindParam(':firstName', $data['firstName']);
        $stmt->bindParam(':lastName', $data['lastName']);
        $stmt->bindParam(':gender', $data['gender']);
        $stmt->bindParam(':birthday', $data['birthday']);
        return $stmt->execute();
    }

    public function deleteStudent(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM students WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function setItemsPerPage(int $itemsPerPage): void
    {
        $this->itemsPerPage = $itemsPerPage;
    }

    public function getItemsPerPage(): int
    {
        return $this->itemsPerPage;
    }
}