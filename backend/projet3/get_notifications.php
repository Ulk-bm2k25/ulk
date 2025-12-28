<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

try {
    
    $sql = "SELECT n.*, u.nom, u.prenom 
            FROM notifications n
            JOIN users u ON n.user_id = u.id
            ORDER BY n.date_envoi DESC
            LIMIT 100";
    
    $stmt = $pdo->query($sql);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($logs);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
