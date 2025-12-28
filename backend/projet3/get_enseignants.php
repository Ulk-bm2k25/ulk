<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

try {
    $sql = "SELECT u.nom, u.prenom, u.email, e.id as enseignant_id, e.matiere, 
            GROUP_CONCAT(c.nom SEPARATOR ', ') as classes_list
            FROM users u
            JOIN enseignants e ON u.id = e.user_id
            LEFT JOIN enseignant_classe ec ON e.id = ec.enseignant_id
            LEFT JOIN classes c ON ec.classe_id = c.id
            WHERE u.role = 'ENSEIGNANT'
            GROUP BY e.id
            ORDER BY u.nom ASC";
    
    $stmt = $pdo->query($sql);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    
    foreach ($data as &$ens) {
        $ens['classes'] = $ens['classes_list'] ? explode(', ', $ens['classes_list']) : [];
    }

    echo json_encode($data);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
