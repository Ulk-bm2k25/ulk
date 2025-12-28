<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_POST['classe_id'] ?? null;
$matiere_id = $_POST['matiere_id'] ?? null;
$coefficient = $_POST['coefficient'] ?? null;

if (!$classe_id || !$matiere_id || $coefficient === null) {
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

try {
    $sql = "INSERT INTO classe_matiere_coeff (classe_id, matiere_id, coefficient) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE coefficient = VALUES(coefficient)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$classe_id, $matiere_id, $coefficient]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>