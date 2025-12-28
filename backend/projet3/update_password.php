<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$user_id = $_POST['user_id'] ?? '';
$old_password = $_POST['old_password'] ?? '';
$new_password = $_POST['new_password'] ?? '';

if ($user_id && $old_password && $new_password) {
    try {
        
        $stmt = $pdo->prepare("SELECT mot_de_passe FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(["success" => false, "error" => "Utilisateur non trouvé"]);
            exit;
        }

        
        if (!password_verify($old_password, $user['mot_de_passe'])) {
            echo json_encode(["success" => false, "error" => "L'ancien mot de passe est incorrect"]);
            exit;
        }

        
        $hashedPassword = password_hash($new_password, PASSWORD_DEFAULT);
        $update = $pdo->prepare("UPDATE users SET mot_de_passe = ?, doit_changer_mdp = 0 WHERE id = ?");
        $update->execute([$hashedPassword, $user_id]);


        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Données manquantes"]);
}
