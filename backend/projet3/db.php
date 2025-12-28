<?php


$host = 'localhost';
$db   = 'ecole_plus'; 
$user = 'root';
$pass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    if (!headers_sent()) {
        header('Content-Type: application/json', true, 500);
    }
    echo json_encode(["success" => false, "error" => "Erreur de connexion à la base de données."]);
    exit;
}