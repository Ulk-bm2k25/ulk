<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_POST['classe_id'] ?? null;
$matiere_id = $_POST['matiere_id'] ?? null;

if (!$classe_id || !$matiere_id) {
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

try {
    $sql = "DELETE FROM classe_matiere_coeff WHERE classe_id = ? AND matiere_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$classe_id, $matiere_id]);

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
