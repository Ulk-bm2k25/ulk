<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_GET['classe_id'] ?? '';
$matiere_id = $_GET['matiere_id'] ?? '';
$semestre_id = $_GET['semestre_id'] ?? '';

if ($classe_id && $matiere_id && $semestre_id) {
    try {
        $sql = "SELECT n.*, n.type_evaluation, n.numero_evaluation
                FROM notes n
                JOIN eleves e ON n.eleve_id = e.id
                WHERE e.classe_id = ? 
                AND n.matiere_id = ? 
                AND n.semestre_id = ?
                ORDER BY n.eleve_id, n.type_evaluation, n.numero_evaluation";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$classe_id, $matiere_id, $semestre_id]);
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($notes);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode([]);
}
?>
