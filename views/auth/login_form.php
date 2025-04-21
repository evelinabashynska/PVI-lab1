<!DOCTYPE html>
<html>
<head>
    <title>Вхід</title>
</head>
<body>
    <h1>Вхід</h1>
    <?php if (isset($error)): ?>
        <p style="color: red;"><?= $error ?></p>
    <?php endif; ?>
    <form method="post" action="/login">
        <div>
            <label for="login">Логін:</label>
            <input type="text" id="login" name="login" required>
        </div>
        <div>
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Увійти</button>
    </form>
</body>
</html>