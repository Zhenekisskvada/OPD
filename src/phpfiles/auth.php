<?php
    $login = filter_var(trim($_POST['login_username']),
    FILTER_SANITIZE_STRING);
    $password = filter_var(trim($_POST['login_password']),
    FILTER_SANITIZE_STRING);

    $password = md5($password."hjdsfl204902asd");

    $mysql = new mysqli('opd','root','','OPD-users-db');

    $result = $mysql->query("SELECT * FROM `users` WHERE `login` = '$login' AND `password` = '$password'");
    $user = $result->fetch_assoc();
    if (count($user) == 0) {
    echo "Пользователь не найден";
    exit();
    }

    setcookie('user', $user['login'], time() + 3600, "/");

    $mysql->close();

    header('Location: ../smth.php');
?>
