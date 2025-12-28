<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

try {
    $stmt = $pdo->query("SELECT * FROM series ORDER BY nom");
    $series = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($series);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
