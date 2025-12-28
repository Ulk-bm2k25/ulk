<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');


$eleve_id = $_POST['eleve_id'] ?? null;
$matiere_id = $_POST['matiere_id'] ?? null;
$valeur = $_POST['valeur'] ?? null;
$semestre_id = $_POST['semestre_id'] ?? null; 

if ($eleve_id && $matiere_id && $valeur !== null && $semestre_id) {
    try {
        
        $stmt_check = $pdo->prepare("SELECT d.id FROM deliberations d 
                                    INNER JOIN eleves e ON d.classe_id = e.classe_id 
                                    WHERE e.id = ? AND d.semestre_id = ?");
        $stmt_check->execute([$eleve_id, $semestre_id]);
        if ($stmt_check->fetch()) {
            echo json_encode(["success" => false, "error" => "Le conseil de classe est clos pour ce semestre. Les notes sont verrouillées."]);
            exit;
        }

        $sql = "INSERT INTO notes (eleve_id, matiere_id, valeur, semestre_id, statut) 
                VALUES (?, ?, ?, ?, 'BROUILLON')";
        
        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute([
            $eleve_id, 
            $matiere_id, 
            $valeur, 
            $semestre_id
        ]);



        if ($success) {
            echo json_encode(["success" => true, "message" => "Note enregistrée avec succès"]);
        } else {
            echo json_encode(["success" => false, "error" => "Erreur lors de l'exécution SQL"]);
        }

    } catch (PDOException $e) {
        
        echo json_encode(["success" => false, "error" => "Erreur SQL : " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Champs manquants : eleve=$eleve_id, matiere=$matiere_id, valeur=$valeur"]);
}
?>