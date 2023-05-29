<?php
    $mysql = new mysqli('opd','root','','OPD-users-db');

    $firstValue = $mysql->query("SELECT * FROM `system_administrator` where `id` = 7");
    $user = $firstValue->fetch_assoc();
    echo $user

?>
