<?php
    $login = filter_var(trim($_POST['username']),
    FILTER_SANITIZE_STRING);
    $password = filter_var(trim($_POST['password']),
    FILTER_SANITIZE_STRING);
    $second_password = filter_var(trim($_POST['second_password']),
    FILTER_SANITIZE_STRING);

    if (mb_strlen($login) < 5 || mb_strlen($login) > 50) {
        echo "Недопустимая длина логина";
        exit();
    } else if (mb_strlen($password) < 5 || mb_strlen($login) > 32) {
        echo "Недопустимая длина пароля";
        exit();
    } else if ($second_password != $password) {
        echo "Пароли не совпадают";
        exit();
    }

    $password = md5($password."hjdsfl204902asd");

    $mysql = new mysqli('opd','root','','OPD-users-db');
    $mysql->query("INSERT INTO `users` (`login`, `password`) values ('$login', '$password')");
    $mysql->close();

    header('Location: ../smth.php');
?>
