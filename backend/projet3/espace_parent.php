<?php
require_once('db.php');
session_start();


if (!isset($_SESSION['parent_id'])) {
    header("Location: login.php");
    exit;
}


$parent_user_id = $_SESSION['parent_id'];

try {
    
    $query = "SELECT e.id, u.nom, u.prenom 
              FROM eleves e
              JOIN users u ON e.user_id = u.id
              JOIN parent_eleve pe ON e.id = pe.eleve_id
              JOIN parents p ON pe.parent_id = p.id
              WHERE p.user_id = :pid";

    $stmt = $pdo->prepare($query);
    $stmt->execute(['pid' => $parent_user_id]);
    
    
    $enfants = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Erreur de récupération des données : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mon Espace Parent - Ecole Plus</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f7f6; padding: 50px; text-align: center; color: #333; }
        .card { background: white; padding: 30px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.08); min-width: 400px; }
        h1 { color: #2c3e50; margin-bottom: 5px; }
        .welcome-text { color: #7f8c8d; margin-bottom: 30px; }
        .enfant-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 5px solid #27ae60; margin-bottom: 15px; text-align: left; display: flex; justify-content: space-between; align-items: center; }
        .enfant-name { font-size: 18px; font-weight: bold; color: #2c3e50; }
        .btn { background: #27ae60; color: white; padding: 8px 15px; text-decoration: none; border-radius: 5px; font-size: 14px; transition: 0.3s; }
        .btn:hover { background: #219150; }
        .logout { margin-top: 20px; display: block; color: #e74c3c; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>

    <div class="card">
        <h1>Bonjour, <?= htmlspecialchars($_SESSION['parent_nom']) ?></h1>
        <p class="welcome-text">Bienvenue dans votre espace de suivi scolaire.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 25px;">

        <?php if ($enfants): ?>
            <?php foreach ($enfants as $enfant): ?>
                <div class="enfant-box">
                    <span class="enfant-name"><?= htmlspecialchars($enfant['prenom'] . " " . $enfant['nom']) ?></span>
                    <a href="bulletin.php?id=<?= $enfant['id'] ?>" class="btn">Voir le bulletin</a>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p style="color: #e67e22;">Aucun enfant n'est rattaché à votre compte pour le moment.</p>
        <?php endif; ?>

        <a href="deconnexion.php" class="logout">Se déconnecter</a>
    </div>

</body>
</html>