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
$notes = $data['notes'] ?? [];

if (empty($notes)) {
    echo json_encode(["success" => false, "error" => "Aucune note à enregistrer"]);
    exit;
}

try {
    $pdo->beginTransaction();
    $saved = 0;
    $skipped = 0;

    foreach ($notes as $note) {
        $eleve_id = $note['eleve_id'];
        $matiere_id = $note['matiere_id'];
        $semestre_id = $note['semestre_id'];
        $type_evaluation = $note['type_evaluation'];
        $numero_evaluation = $note['numero_evaluation'];
        $valeur = $note['valeur'];

        
        $stmt_check = $pdo->prepare("SELECT d.id FROM deliberations d 
                                    INNER JOIN eleves e ON d.classe_id = e.classe_id 
                                    WHERE e.id = ? AND d.semestre_id = ?");
        $stmt_check->execute([$eleve_id, $semestre_id]);
        if ($stmt_check->fetch()) {
            $skipped++;
            continue; 
        }

        
        $check = $pdo->prepare("SELECT statut FROM notes 
                               WHERE eleve_id = ? AND matiere_id = ? AND semestre_id = ? 
                               AND type_evaluation = ? AND numero_evaluation = ?");
        $check->execute([$eleve_id, $matiere_id, $semestre_id, $type_evaluation, $numero_evaluation]);
        $existing = $check->fetch(PDO::FETCH_ASSOC);

        if ($existing && $existing['statut'] === 'VALIDE') {
            $skipped++;
            continue; 
        }

        
        
        $stmt = $pdo->prepare("INSERT INTO notes 
                             (eleve_id, matiere_id, semestre_id, valeur, type_evaluation, numero_evaluation, statut) 
                             VALUES (?, ?, ?, ?, ?, ?, 'BROUILLON')
                             ON DUPLICATE KEY UPDATE 
                             valeur = VALUES(valeur),
                             statut = 'BROUILLON',
                             date_note = CURRENT_DATE");
        $stmt->execute([$eleve_id, $matiere_id, $semestre_id, $valeur, $type_evaluation, $numero_evaluation]);
        $saved++;
    }

    $pdo->commit();
    echo json_encode([
        "success" => true, 
        "saved" => $saved,
        "skipped" => $skipped,
        "message" => "$saved note(s) enregistrée(s)" . ($skipped > 0 ? ", $skipped ignorée(s) (validées ou verrouillées)" : "")
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
