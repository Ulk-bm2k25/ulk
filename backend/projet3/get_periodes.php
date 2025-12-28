<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once('db.php');

try {
    $stmt = $pdo->query("SELECT id, nom, type, annee_scolaire FROM periodes ORDER BY id ASC");
    $periodes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($periodes);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
