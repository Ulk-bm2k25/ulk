<?php
require_once('db.php');

$email = "admin@ecole.sn";
$new_pass = "admin123";
$hash = password_hash($new_pass, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("UPDATE users SET mot_de_passe = ? WHERE email = ?");
    $stmt->execute([$hash, $email]);
    
    if ($stmt->rowCount() > 0) {
        echo "Mot de passe mis à jour avec succès pour $email ! Nouveau pass : $new_pass";
    } else {
        echo "Aucun utilisateur trouvé avec l'email $email. Exécutez d'abord create_admin.php.";
    }
} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>
