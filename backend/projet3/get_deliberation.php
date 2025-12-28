<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_GET['classe_id'] ?? null;
$semestre_id = $_GET['semestre_id'] ?? null;

if ($classe_id && $semestre_id) {
    try {
        
        $sql = "SELECT e.id as eleve_id, 
                       u.nom, 
                       u.prenom,
                       SUM(moyennes_matiere.moyenne * moyennes_matiere.coefficient) / SUM(moyennes_matiere.coefficient) as moyenne_generale
                FROM eleves e
                JOIN users u ON e.user_id = u.id
                JOIN (
                    -- Sous-requête pour calculer la moyenne par matière/élève
                    SELECT n.eleve_id, 
                           n.matiere_id, 
                           AVG(n.valeur) as moyenne,
                           COALESCE(cmc.coefficient, m.coefficient) as coefficient
                    FROM notes n
                    JOIN matieres m ON n.matiere_id = m.id
                    JOIN eleves e2 ON n.eleve_id = e2.id
                    LEFT JOIN classe_matiere_coeff cmc ON (cmc.classe_id = e2.classe_id AND cmc.matiere_id = m.id)
                    WHERE n.semestre_id = ? AND n.statut = 'VALIDE'
                    GROUP BY n.eleve_id, n.matiere_id
                ) as moyennes_matiere ON e.id = moyennes_matiere.eleve_id
                WHERE e.classe_id = ?
                GROUP BY e.id
                ORDER BY moyenne_generale DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$semestre_id, $classe_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        
        foreach ($results as $index => &$row) {
            $row['rang'] = $index + 1;
            $row['decision'] = ($row['moyenne_generale'] >= 10) ? 'Admis' : 'Échec';
            $row['moyenne_generale'] = round($row['moyenne_generale'], 2);
        }

        
        $stmt_clos = $pdo->prepare("SELECT id FROM deliberations WHERE classe_id = ? AND semestre_id = ?");
        $stmt_clos->execute([$classe_id, $semestre_id]);
        $est_clos = (bool)$stmt_clos->fetch();

        echo json_encode([
            "results" => $results,
            "est_clos" => $est_clos
        ]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Paramètres manquants (classe_id ou semestre_id)"]);
}
?>
