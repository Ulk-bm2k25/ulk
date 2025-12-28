<?php
require_once('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $eleve_id = $_POST['eleve_id'];
    $matiere_id = $_POST['matiere_id'];
    $semestre_id = $_POST['semestre_id'];
    $valeur = $_POST['valeur'];

    try {
        $sql = "INSERT INTO notes (eleve_id, matiere_id, semestre_id, valeur) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$eleve_id, $matiere_id, $semestre_id, $valeur]);

        echo "La note a été enregistrée avec succès ! <br>";
        echo "<a href='../frontend/saisir_note.php'>Saisir une autre note</a> | <a href='../Frontend/index.php'>Accueil</a>";
    } catch (PDOException $e) {
        die("Erreur lors de l'enregistrement de la note : " . $e->getMessage());
    }
}
?>