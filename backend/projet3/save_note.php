<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$eleve_id = $_POST['eleve_id'] ?? '';
$matiere_id = $_POST['matiere_id'] ?? '';
$valeur = $_POST['note'] ?? ''; 

$semestre_id = $_POST['semestre_id'] ?? 1; 

if ($eleve_id && $matiere_id && $valeur !== '') {
    try {
        
        $sql = "INSERT INTO notes (eleve_id, matiere_id, semestre_id, valeur, date_note) 
                VALUES (?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$eleve_id, $matiere_id, $semestre_id, $valeur]);
        
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => "Erreur BDD: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Données incomplètes"]);
}