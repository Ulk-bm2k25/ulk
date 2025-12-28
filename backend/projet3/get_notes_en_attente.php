<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');


$sql = "SELECT n.id, u.nom, u.prenom, m.nom AS matiere, n.valeur, n.type_evaluation, n.numero_evaluation
        FROM notes n
        JOIN eleves e ON n.eleve_id = e.id
        JOIN users u ON e.user_id = u.id 
        JOIN matieres m ON n.matiere_id = m.id
        WHERE n.statut = 'BROUILLON'
        ORDER BY u.nom, u.prenom, m.nom, n.type_evaluation, n.numero_evaluation";


$stmt = $pdo->query($sql);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>