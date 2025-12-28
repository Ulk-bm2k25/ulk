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

$nom = $data['nom'] ?? '';
$prenom = $data['prenom'] ?? '';
$email = $data['email'] ?? '';
$matiere = $data['matiere'] ?? '';
$classes = $data['selectedClasses'] ?? [];

if ($nom && $prenom && $email && $matiere && !empty($classes)) {
    try {
        $pdo->beginTransaction();

        
        $pass_hash = password_hash("1234", PASSWORD_DEFAULT);
        $stmtU = $pdo->prepare("INSERT INTO users (nom, prenom, email, mot_de_passe, role, doit_changer_mdp) VALUES (?, ?, ?, ?, 'ENSEIGNANT', 1)");
        $stmtU->execute([$nom, $prenom, $email, $pass_hash]);

        $user_id = $pdo->lastInsertId();

        
        $stmtE = $pdo->prepare("INSERT INTO enseignants (user_id, matiere) VALUES (?, ?)");
        $stmtE->execute([$user_id, $matiere]);
        $enseignant_id = $pdo->lastInsertId();

        
        $stmtC = $pdo->prepare("INSERT INTO enseignant_classe (enseignant_id, classe_id) VALUES (?, ?)");
        foreach ($classes as $classe_id) {
            $stmtC->execute([$enseignant_id, $classe_id]);
        }

        $pdo->commit();
        echo json_encode(["success" => true]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Données incomplètes"]);
}
?>
