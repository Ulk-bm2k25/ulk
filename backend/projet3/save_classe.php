<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$id = $_POST['id'] ?? null;
$nom = $_POST['nom'] ?? null;
$annee_scolaire = $_POST['annee_scolaire'] ?? '2023-2024';

if (!$nom) {
    echo json_encode(["error" => "Le nom de la classe est obligatoire"]);
    exit;
}

try {
    if ($id) {
        $sql = "UPDATE classes SET nom = ?, annee_scolaire = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nom, $annee_scolaire, $id]);
        echo json_encode(["success" => true, "message" => "Classe mise à jour"]);
    } else {
        $sql = "INSERT INTO classes (nom, annee_scolaire) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nom, $annee_scolaire]);
        echo json_encode(["success" => true, "message" => "Classe créée", "id" => $pdo->lastInsertId()]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
