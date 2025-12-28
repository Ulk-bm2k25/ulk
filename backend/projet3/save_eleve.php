<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$email_e = $_POST['email_eleve'] ?? '';
$email_p = $_POST['email_parent'] ?? '';
$classe_id = $_POST['classe_id'] ?? '';

if ($nom && $prenom && $email_e && $classe_id) {
    try {
        $pdo->beginTransaction();
        
        $mdp_temp = password_hash("Bienvenue2025", PASSWORD_DEFAULT);

        
        $stmtE = $pdo->prepare("INSERT INTO users (nom, prenom, email, mot_de_passe, role, doit_changer_mdp) VALUES (?, ?, ?, ?, 'ELEVE', 1)");
        $stmtE->execute([$nom, $prenom, $email_e, $mdp_temp]);
        $user_id_eleve = $pdo->lastInsertId();

        
        $stmtL = $pdo->prepare("INSERT INTO eleves (user_id, classe_id) VALUES (?, ?)");
        $stmtL->execute([$user_id_eleve, $classe_id]);
        $eleve_id = $pdo->lastInsertId();

        
        if (!empty($email_p)) {
            
            $stmtUP = $pdo->prepare("INSERT INTO users (nom, prenom, email, mot_de_passe, role, doit_changer_mdp) VALUES (?, ?, ?, ?, 'PARENT', 1)");
            $stmtUP->execute([$nom, "Parent", $email_p, $mdp_temp]);
            $user_id_parent = $pdo->lastInsertId();

            
            $stmtP = $pdo->prepare("INSERT INTO parents (user_id) VALUES (?)");
            $stmtP->execute([$user_id_parent]);
            $parent_id = $pdo->lastInsertId();

            
            $stmtLink = $pdo->prepare("INSERT INTO parent_eleve (parent_id, eleve_id) VALUES (?, ?)");
            $stmtLink->execute([$parent_id, $eleve_id]);
        }

        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Données du formulaire incomplètes"]);
}
?>