<?php
require_once('db.php');

$nom = "SOW";
$prenom = "Moussa";
$email = "prof.sow@ecole.sn";
$password = password_hash("enseignant123", PASSWORD_DEFAULT);
$role = "ENSEIGNANT";
$matiere = "Mathématiques";

try {
    $pdo->beginTransaction();

    
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        echo "L'enseignant avec l'email $email existe déjà ! Tentative de mise à jour du mot de passe...<br>";
        $update = $pdo->prepare("UPDATE users SET mot_de_passe = ? WHERE email = ?");
        $update->execute([$password, $email]);
        echo "Mot de passe mis à jour vers : enseignant123<br>";
    } else {
        
        $sql = "INSERT INTO users (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nom, $prenom, $email, $password, $role]);
        $user_id = $pdo->lastInsertId();

        
        $sql_ens = "INSERT INTO enseignants (user_id, matiere) VALUES (?, ?)";
        $stmt_ens = $pdo->prepare($sql_ens);
        $stmt_ens->execute([$user_id, $matiere]);
        
        echo "Enseignant créé avec succès !<br>";
        echo "Login: <b>$email</b><br>";
        echo "Mot de passe: <b>enseignant123</b><br>";
    }

    $pdo->commit();
} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo "Erreur lors de la création : " . $e->getMessage();
}
?>
