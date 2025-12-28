<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$id = $_POST['id'] ?? null;
$nom = $_POST['nom'] ?? null;
$coefficient = $_POST['coefficient'] ?? 1;

if (!$nom) {
    echo json_encode(["error" => "Le nom de la matière est obligatoire"]);
    exit;
}

try {
    if ($id) {
        
        $sql = "UPDATE matieres SET nom = ?, coefficient = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nom, $coefficient, $id]);
        echo json_encode(["success" => true, "message" => "Matière mise à jour"]);
    } else {
        
        $sql = "INSERT INTO matieres (nom, coefficient) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nom, $coefficient]);
        echo json_encode(["success" => true, "message" => "Matière créée", "id" => $pdo->lastInsertId()]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
