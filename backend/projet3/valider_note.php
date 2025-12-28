<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once('db.php');

$id = $_POST['id'] ?? null;

if ($id) {
    try {
        $sql = "UPDATE notes SET statut = 'VALIDE' WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute([$id])) {
            
            require_once('notifications.php');
            notifyParentAboutNote($id);
            
            echo json_encode(["success" => true, "message" => "Note validée et parent notifié"]);

        } else {
            echo json_encode(["success" => false, "error" => "Échec de la validation"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "ID manquant"]);
}
?>
