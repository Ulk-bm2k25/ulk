<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once('db.php');

try {
    
    $stmt = $pdo->prepare("UPDATE notes SET statut = 'VALIDE' WHERE statut = 'BROUILLON'");
    $stmt->execute();
    
    $count = $stmt->rowCount();

    echo json_encode([
        "success" => true,
        "message" => "$count note(s) ont été approuvées avec succès.",
        "count" => $count
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
