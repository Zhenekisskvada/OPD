<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Opd vsyakoe</title>
    <link rel = "stylesheet" href="styles/magic.css">
    <link rel = "stylesheet" href="styles/main.css">
    <script src="Objects/app.js" defer></script>
    <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js"></script>
</head>

<body>

<header class="main-header">
    <div class="layers">
        <div class="layers_header">
            <div class="layers_caption">Opd project</div>
            <div class="layers_title">Сhoosing a profession</div>
        </div>
        <div class="layer layers_base" style="background-image: url(images/Back2.png);"></div>
        <div class="layer layers_front" style="background-image: url(images/Back1.png);"></div>
    </div>
</header>

<article id="podval" class="main-article" style="background-image: url(images/BackArt.jpg);">
    <div class="window-professions">
        <table class="textcols-item">
            <tr>
                <th><a href="#popup">Системный администратор</a></th>
                <th><a href="#2popup">Веб-разработчик</a></th>
                <th><a href="#3popup">Аналитик данных</a></th>
            </tr>

            <?php
        if($_COOKIE['user'] != ''):
        ?>
            <tr class="statistic">
                <td><div class="statistic_color"><a href="evaluation/characteristics.html">Установить качества</a></div></td>
                <td><div class="statistic_color"><a href="evaluation/characteristics2.html">Установить качества</a></div></td>
                <td><div class="statistic_color"><a href="evaluation/characteristics3.html">Установить качества</a></div></td>
            </tr>
            <p class="statistic1"><a href="statistic.html">Посмотреть статистику</a></p>
            <?php else: ?>
            <tr class="statistic">
                <td><div class="statistic_color">СТАТИСТИКА</div></td>
                <td><div class="statistic_color">СТАТИСТИКА</div></td>
                <td><div class="statistic_color">СТАТИСТИКА</div></td>

            </tr>
            <?php endif;?>
        </table>
    </div>


        </table>
    </div>
    <?php
    if($_COOKIE['user'] == ''):
    ?>
    <div class="login_body">
        <div class="login_header">
            LOGIN
        </div>
        <div class="login_content">
            <form action="phpfiles/auth.php" method="post">
                <input type="text" name="login_username" placeholder="Введите ваш логин">
                <input type="password" name="login_password" placeholder="Введите ваш пароль">
                <input class="button" type="submit" value="Войти">
            </form>
            <div class="login_podval">Нет акаунта? <a class="login_a" href="#4popup">Регистрация</a> </div>
        </div>
    </div>

    <div class="button_login">
        <a class="button" type="button" href="moderator.html">Войти</a>
        <a class="button" type="button" href="src/moderator.php">Войти</a>
    </div>

    <?php else: ?>
    <div class="login_body">
        <div class="login_header">
            Добро пожаловать!
        </div>
        <div class="login_content">
            <p>Вы авторизованы под именем <?=$_COOKIE['user']?> </p>
            <p>Чтобы выйти, нажмите <a href="phpfiles/exit.php">здесь</a>.</p>
            <p>Чтобы перейти в меню эксперта, нажмите <a href="moderator.php">здесь</a>.</p>
        </div>
    </div>

    <?php endif;?>

    <div class="moder_body">
        <div class="moder_header">
            <div class="moder_header_content"> Модераторы
            </div>
        </div>
        <div class="moder_content">
            <form action="">
                <select class="moder_list" size="4">
                    <option>Best Igor</option>
                    <option>Anton</option>
                    <option>Anton</option>
                    <option>Evgeniy</option>
                    <option>Ilya</option>
                    <option>Maksim</option>
                </select>
            </form>
        </div>
    </div>

    <div id="popup" class="popup">
        <div class="popup_body">
            <div class="popup_content">
                <a href="#podval" class="popup_close">X</a>
                <div class="popup_title">Системный администратор
                    <div class="popup_text">Специалист широкого профиля, который отвечает за стабильное и безотказное функционирование ИТ-инфраструктуры, осуществляет мониторинг, проводит инвентаризацию, отвечает за безопасность пользователей, занимается сетями и т.д. Это многорукий и многоголовый бог ИТ-инфраструктуры, который берёт на себя обязанности по обеспечению всей ИТ-жизнедеятельности компании.
                        + РЕЙТИНГ
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="2popup" class="popup">
        <div class="popup_body">
            <div class="popup_content">
                <a href="#podval" class="popup_close">X</a>
                <div class="popup_title">Веб-разработчик
                    <div class="popup_text">Специалист, который создаёт новые и поддерживает уже существующие сайты. Он помогает заказчику решить задачу оптимальным способом, пишет код, тестирует его и оценивает результаты.
                        + РЕЙТИНГ

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="3popup" class="popup">
        <div class="popup_body">
            <div class="popup_content">
                <a href="#podval" class="popup_close">X</a>
                <div class="popup_title">Аналитик данных
                    <div class="popup_text">Специалист, который работает с данными: собирает их, обрабатывает, изучает и интерпретирует. Выводы, которые делает аналитик, помогают принимать решения в бизнесе, в научных исследованиях, в менеджменте и в других областях.
                        + РЕЙТИНГ

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="4popup" class="popup">
        <div class="popup_body">
            <div class="regist_content">
                <a href="#podval" class="popup_close">X</a>
                <div class="login_header"> РЕГИСТРАЦИЯ
                </div>
                    <form action="phpfiles/check.php" method="post">
                        <input class="register_input" type="text" name="username" placeholder="Введите ваш логин">
                        <input class="register_input" type="password" name="password" placeholder="Введите пароль">
                        <input class="register_input" type="password" name="second_password" placeholder="Введите пароль еще раз">
                        <input class="register_button" type="submit" value="Регистрация">
                    </form>
            </div>
        </div>
    </div>

</article>
</body>
</html>
