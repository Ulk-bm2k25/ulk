<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(["error" => "user_id manquant"]);
    exit;
}

try {
    
    $stmt = $pdo->prepare("SELECT id, matiere FROM enseignants WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $enseignant = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$enseignant) {
        echo json_encode(["error" => "Enseignant non trouvé"]);
        exit;
    }

    
    $stmt_classes = $pdo->prepare("SELECT c.id, c.nom 
                                   FROM classes c
                                   JOIN enseignant_classe ec ON c.id = ec.classe_id
                                   WHERE ec.enseignant_id = ?
                                   ORDER BY c.nom");
    $stmt_classes->execute([$enseignant['id']]);
    $classes = $stmt_classes->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "classes" => $classes,
        "matiere" => $enseignant['matiere']
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
