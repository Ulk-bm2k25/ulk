<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');


$matiere_id = $_GET['matiere_id'] ?? null;

if ($matiere_id) {
    try {
        
        $sql = "SELECT e.nom, e.prenom, n.valeur AS note, n.date_enregistrement AS date_saisie 
                FROM notes n
                JOIN eleves e ON n.eleve_id = e.id
                WHERE n.matiere_id = ?
                ORDER BY n.date_enregistrement DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$matiere_id]);
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        
        echo json_encode($notes);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode([]);
}
?>