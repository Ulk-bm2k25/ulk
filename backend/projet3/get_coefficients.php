<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_GET['classe_id'] ?? null;

if (!$classe_id) {
    echo json_encode(["error" => "ID classe manquant"]);
    exit;
}

try {
    
    
    $sql = "SELECT m.id as matiere_id, m.nom as matiere_nom, 
            COALESCE(cmc.coefficient, m.coefficient) as coefficient,
            CASE WHEN cmc.classe_id IS NOT NULL THEN 1 ELSE 0 END as is_assigned
            FROM matieres m
            LEFT JOIN classe_matiere_coeff cmc ON m.id = cmc.matiere_id AND cmc.classe_id = ?
            ORDER BY m.nom";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$classe_id]);
    $coeffs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($coeffs);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
