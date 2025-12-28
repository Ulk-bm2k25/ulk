<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once('db.php');

try {
    $stmt = $pdo->query("SELECT id, nom FROM semestres ORDER BY id ASC");
    $semestres = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($semestres);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
