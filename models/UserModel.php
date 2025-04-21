<?php

class UserModel
{
    private $db;

    public function __construct()
    {
        $config = require __DIR__ . '/../config/database.php';
        try {
            $this->db = new PDO("mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8", $config['user'], $config['password']);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Помилка підключення до бази даних: " . $e->getMessage());
        }
    }

    public function getUserByLogin(string $login): ?array
    {
        $stmt = $this->db->prepare("SELECT id, login, password FROM students WHERE login = :login");
        $stmt->bindParam(':login', $login);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ? $user : null;
    }
}