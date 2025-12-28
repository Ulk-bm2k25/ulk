<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_GET['classe_id'] ?? null;
$semestre_id = $_GET['semestre_id'] ?? null;

if ($semestre_id) {
    try {
        
        $sql = "SELECT m.nom as matiere, 
                       AVG(n.valeur) as moyenne_matiere,
                       MIN(n.valeur) as note_min,
                       MAX(n.valeur) as note_max,
                       COUNT(n.id) as total_notes
                FROM notes n
                JOIN matieres m ON n.matiere_id = m.id
                JOIN eleves e ON n.eleve_id = e.id
                WHERE n.semestre_id = ? AND n.statut = 'VALIDE'";
        
        $params = [$semestre_id];
        
        if ($classe_id) {
            $sql .= " AND e.classe_id = ?";
            $params[] = $classe_id;
        }
        
        $sql .= " GROUP BY m.id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $stats = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($stats);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Semestre non spécifié"]);
}
?>
