<?php
    $session = filter_var(trim($_COOKIE['user']),
    FILTER_SANITIZE_STRING);
    $firstQuality = filter_var(trim($_POST['firstQuality']),
    FILTER_SANITIZE_STRING);
    $secondQuality = filter_var(trim($_POST['secondQuality']),
    FILTER_SANITIZE_STRING);
    $thirdQuality = filter_var(trim($_POST['thirdQuality']),
    FILTER_SANITIZE_STRING);
    $fourthQuality = filter_var(trim($_POST['fourthQuality']),
    FILTER_SANITIZE_STRING);
    $fifthQuality = filter_var(trim($_POST['fifthQuality']),
    FILTER_SANITIZE_STRING);

    $mysql = new mysqli('opd','root','','OPD-users-db');
    $mysql->query("INSERT INTO `web_developer` (`quality`, `given_by`) values ('$firstQuality', '$session')");
    $mysql->query("INSERT INTO `web_developer` (`quality`, `given_by`) values ('$secondQuality', '$session')");
    $mysql->query("INSERT INTO `web_developer` (`quality`, `given_by`) values ('$thirdQuality', '$session')");
    $mysql->query("INSERT INTO `web_developer` (`quality`, `given_by`) values ('$fourthQuality', '$session')");
    $mysql->query("INSERT INTO `web_developer` (`quality`, `given_by`) values ('$fifthQuality', '$session')");
    $mysql->close();

    header('Location: ../smth.php');
?>
