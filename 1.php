<?php
/**
 * Created by PhpStorm.
 * User: ffctv
 * Date: 2019/11/9
 * Time: 16:11
 */

$connection =  ssh2_connect('47.91.221.244', 1717);
$user = "root";
$pass = "Macbookair99";
if (ssh2_auth_password($connection,$user,$pass))  {
    ssh2_scp_send($connection, 'index.php', '/data/web/index.php', 0644);
}else{
    die("Authentication Failed...");
}