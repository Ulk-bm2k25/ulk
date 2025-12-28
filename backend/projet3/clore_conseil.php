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

$data = json_decode(file_get_contents("php://input"), true);

$classe_id = $data['classe_id'] ?? '';
$semestre_id = $data['semestre_id'] ?? '';
$responsable_id = $data['responsable_id'] ?? '';

if ($classe_id && $semestre_id && $responsable_id) {
    try {
        $pdo->beginTransaction();

        
        $check = $pdo->prepare("SELECT id FROM deliberations WHERE classe_id = ? AND semestre_id = ?");
        $check->execute([$classe_id, $semestre_id]);
        if ($check->fetch()) {
            echo json_encode(["success" => false, "error" => "Ce conseil de classe est déjà clos."]);
            $pdo->rollBack();
            exit;
        }

        
        
        $stmt_notes = $pdo->prepare("UPDATE notes n 
                                    INNER JOIN eleves e ON n.eleve_id = e.id 
                                    SET n.verrouille = 1 
                                    WHERE e.classe_id = ? AND n.semestre_id = ?");
        $stmt_notes->execute([$classe_id, $semestre_id]);

        
        $stmt_delib = $pdo->prepare("INSERT INTO deliberations (classe_id, semestre_id, responsable_id) VALUES (?, ?, ?)");
        $stmt_delib->execute([$classe_id, $semestre_id, $responsable_id]);

        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Conseil de classe clos avec succès. Toutes les notes ont été verrouillées."]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Données manquantes"]);
}
?>
