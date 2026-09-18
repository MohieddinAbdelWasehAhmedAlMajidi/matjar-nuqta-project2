<?php
const DB_HOST = 'sql103.infinityfree.com';
const DB_NAME = 'if0_42826940_tech_db';
const DB_USER = 'if0_42826940';
const DB_PASS = 'ntCsSwxyiwsPtrF';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'ChangeThisAdminPassword123!';
const WHATSAPP_NUMBER = '966500000000';

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4', DB_USER, DB_PASS, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES=>false]);
    return $pdo;
}
function e(?string $value): string { return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8'); }
function money(int $amount): string { return number_format($amount / 100, 2) . ' ر.س'; }
?>
