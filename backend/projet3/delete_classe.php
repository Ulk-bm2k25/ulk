<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$id = $_POST['id'] ?? null;

if (!$id) {
    echo json_encode(["error" => "ID classe manquant"]);
    exit;
}

try {
    $sql = "DELETE FROM classes WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    echo json_encode(["success" => true, "message" => "Classe supprimée"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
