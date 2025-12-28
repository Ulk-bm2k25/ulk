<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once('db.php');

$classe_id = $_GET['classe_id'] ?? null;

try {
    if ($classe_id) {
        
        $query = "SELECT m.id, m.nom, COALESCE(cmc.coefficient, m.coefficient) as coefficient 
                  FROM matieres m
                  JOIN classe_matiere_coeff cmc ON m.id = cmc.matiere_id
                  WHERE cmc.classe_id = ?
                  ORDER BY m.nom ASC";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$classe_id]);
    } else {
        
        $query = "SELECT id, nom, coefficient FROM matieres ORDER BY nom ASC";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
    }
    
    $matieres = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($matieres);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>