<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

try {
    
    $totalEleves = $pdo->query("SELECT COUNT(*) FROM eleves")->fetchColumn();
    
    
    
    $stmt = $pdo->query("SELECT e.id
                         FROM eleves e
                         JOIN (
                            SELECT n.eleve_id, 
                                   SUM(n.valeur * COALESCE(cmc.coefficient, m.coefficient)) / SUM(COALESCE(cmc.coefficient, m.coefficient)) as moyenne_ponderee
                            FROM notes n
                            JOIN matieres m ON n.matiere_id = m.id
                            JOIN eleves el ON n.eleve_id = el.id
                            LEFT JOIN classe_matiere_coeff cmc ON (cmc.classe_id = el.classe_id AND cmc.matiere_id = m.id)
                            WHERE n.statut = 'VALIDE'
                            GROUP BY n.eleve_id
                         ) as moyennes ON e.id = moyennes.eleve_id
                         WHERE moyennes.moyenne_ponderee >= 10");
    $elevesAdmis = count($stmt->fetchAll(PDO::FETCH_ASSOC));
    
    $tauxReussite = $totalEleves > 0 ? round(($elevesAdmis / $totalEleves) * 100, 1) : 0;

    
    $stmt = $pdo->query("SELECT COUNT(*) as nb FROM notes WHERE statut = 'BROUILLON'");
    $brouillons = $stmt->fetch(PDO::FETCH_ASSOC)['nb'];

    
    $sql = "SELECT u.nom, u.prenom, ROUND(moyennes.moyenne_ponderee, 3) as moyenne
            FROM users u
            JOIN eleves e ON u.id = e.user_id
            JOIN (
                SELECT n.eleve_id, 
                       SUM(n.valeur * COALESCE(cmc.coefficient, m.coefficient)) / SUM(COALESCE(cmc.coefficient, m.coefficient)) as moyenne_ponderee
                FROM notes n
                JOIN matieres m ON n.matiere_id = m.id
                JOIN eleves el ON n.eleve_id = el.id
                LEFT JOIN classe_matiere_coeff cmc ON (cmc.classe_id = el.classe_id AND cmc.matiere_id = m.id)
                WHERE n.statut = 'VALIDE'
                GROUP BY n.eleve_id
            ) as moyennes ON e.id = moyennes.eleve_id
            ORDER BY moyenne DESC
            LIMIT 3";
    $stmt = $pdo->query($sql);
    $topEleves = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "taux_reussite" => $tauxReussite,
        "total_eleves" => $totalEleves,
        "eleves_admis" => $elevesAdmis,
        "nb_brouillons" => $brouillons,
        "top_eleves" => $topEleves
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
