<?php
require_once('db.php');

$nom = "Admin";
$prenom = "Principal";
$email = "admin@ecole.sn";

$password = '$2y$10$abcdefghijklmnopqrstuv'; 
$password = password_hash("admin123", PASSWORD_DEFAULT);
$role = "RESPONSABLE";

try {
    $pdo->beginTransaction();

    $sql = "INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nom, $prenom, $email, $password, $role]);
    $user_id = $pdo->lastInsertId();

    $sql_resp = "INSERT INTO responsables (user_id, fonction) VALUES (?, ?)";
    $stmt_resp = $pdo->prepare($sql_resp);
    $stmt_resp->execute([$user_id, 'Directeur']);

    $pdo->commit();
    echo "Responsable créé avec succès ! Login: $email / Pass: admin123";
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo "Erreur lors de la création : " . $e->getMessage();
}
?>
