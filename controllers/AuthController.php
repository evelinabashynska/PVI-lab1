<?php

require_once __DIR__ . '/../models/UserModel.php';

class AuthController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $login = $_POST['login'] ?? '';
            $password = $_POST['password'] ?? '';

            $user = $this->userModel->getUserByLogin($login);

            if ($user && $password === $user['password']) {
                $_SESSION['user_id'] = $user['id'];
                // Перенаправлення на головну сторінку або сторінку зі студентами
                header('Location: /students');
                exit();
            } else {
                $error = 'Неправильний логін або пароль.';
                require __DIR__ . '/../views/auth/login_form.php'; // З передачею помилки
            }
        } else {
            require __DIR__ . '/../views/auth/login_form.php';
        }
    }

    public function logout()
    {
        session_start();
        session_destroy();
        header('Location: /'); // Перенаправлення на головну сторінку
        exit();
    }

    public function isLoggedIn(): bool
    {
        return isset($_SESSION['user_id']);
    }

    // Можна додати методи для перевірки ролей/дозволів, якщо потрібно
}