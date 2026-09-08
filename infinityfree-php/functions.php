<?php
require_once __DIR__ . '/config.php';
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
function products(string $search='', string $category=''): array {
    $sql='SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE 1=1'; $params=[];
    if($search!==''){ $sql.=' AND (p.name LIKE ? OR p.description LIKE ?)'; $params[]='%'.$search.'%'; $params[]='%'.$search.'%'; }
    if($category!==''){ $sql.=' AND p.category_id=?'; $params[]=(int)$category; }
    $sql.=' ORDER BY p.id DESC'; $st=db()->prepare($sql); $st->execute($params); return $st->fetchAll();
}
function product(int $id): ?array { $st=db()->prepare('SELECT p.*,c.name AS category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.id=?'); $st->execute([$id]); return $st->fetch()?:null; }
function cart(): array { return $_SESSION['cart']??[]; }
function cartCount(): int { return array_sum(cart()); }
function cartTotal(): int { $total=0; foreach(cart() as $id=>$qty) if($p=product((int)$id)) $total+=(int)$p['price']*(int)$qty; return $total; }
function redirect(string $url): never { header('Location: '.$url); exit; }
function requireAdmin(): void { if(empty($_SESSION['is_admin'])) redirect('admin-login.php'); }
?>
