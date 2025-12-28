<?php
header("Access-Control-Allow-Origin: *");
require_once('db.php');

$classe_id = $_GET['classe_id'] ?? '';

if ($classe_id) {
    
    $sql = "SELECT eleves.id, users.nom, users.prenom 
            FROM eleves 
            JOIN users ON eleves.user_id = users.id 
            WHERE eleves.classe_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$classe_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}