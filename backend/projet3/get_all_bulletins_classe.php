<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_GET['classe_id'] ?? null;
$semestre_id = $_GET['semestre_id'] ?? null;
$type = $_GET['type'] ?? 'semestre'; 

if (!$classe_id) {
    echo json_encode(["error" => "ID classe manquant"]);
    exit;
}

try {
    
    $stmt = $pdo->prepare("SELECT e.id, u.nom, u.prenom FROM eleves e JOIN users u ON e.user_id = u.id WHERE e.classe_id = ? GROUP BY e.id ORDER BY u.nom, u.prenom");
    $stmt->execute([$classe_id]);
    $eleves = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $results = [];

    foreach ($eleves as $eleve) {
        $eleve_id = $eleve['id'];
        
        if ($type === 'annuel') {
            
            
            $sql = "SELECT m.nom as matiere, 
                    n.semestre_id,
                    AVG(n.valeur) as moyenne_semestre, 
                    COALESCE(cmc.coefficient, m.coefficient) as coefficient
                    FROM notes n
                    JOIN matieres m ON n.matiere_id = m.id
                    JOIN eleves e ON n.eleve_id = e.id
                    LEFT JOIN classe_matiere_coeff cmc ON (cmc.classe_id = e.classe_id AND cmc.matiere_id = m.id)
                    WHERE n.eleve_id = ? AND n.statut = 'VALIDE'
                    GROUP BY m.id, n.semestre_id";
            $stmtNotes = $pdo->prepare($sql);
            $stmtNotes->execute([$eleve_id]);
            $rows = $stmtNotes->fetchAll(PDO::FETCH_ASSOC);

            $matiereData = [];
            $semestreTotals = [];

            foreach ($rows as $r) {
                $m = $r['matiere'];
                $sid = $r['semestre_id'];
                $moy = $r['moyenne_semestre'];
                $coeff = $r['coefficient'];

                if (!isset($matiereData[$m])) {
                    $matiereData[$m] = ['sums' => 0, 'count' => 0, 'coeff' => $coeff];
                }
                $matiereData[$m]['sums'] += $moy;
                $matiereData[$m]['count']++;

                if (!isset($semestreTotals[$sid])) {
                    $semestreTotals[$sid] = ['total_pondere' => 0, 'total_coeffs' => 0];
                }
                $semestreTotals[$sid]['total_pondere'] += $moy * $coeff;
                $semestreTotals[$sid]['total_coeffs'] += $coeff;
            }

            $notes = [];
            $totalPondereAnnuel = 0;
            $totalCoeffAnnuel = 0;
            foreach ($matiereData as $name => $data) {
                $moyAnnMatiere = round($data['sums'] / $data['count'], 2);
                $notes[] = [
                    'matiere' => $name,
                    'moyenne' => $moyAnnMatiere,
                    'coefficient' => $data['coeff'],
                    'total_matiere' => $moyAnnMatiere * $data['coeff']
                ];
                $totalPondereAnnuel += ($moyAnnMatiere * $data['coeff']);
                $totalCoeffAnnuel += $data['coeff'];
            }

            $moyennesSemestres = [];
            foreach ($semestreTotals as $sid => $totals) {
                if ($totals['total_coeffs'] > 0) {
                    $moyennesSemestres[] = $totals['total_pondere'] / $totals['total_coeffs'];
                }
            }
            $moyenneGenerale = count($moyennesSemestres) > 0 ? round(array_sum($moyennesSemestres) / count($moyennesSemestres), 2) : 0;

            $results[] = [
                "eleve" => $eleve,
                "notes" => $notes,
                "moyenne_generale" => $moyenneGenerale,
                "moyenne_s1" => isset($moyennesSemestres[0]) ? round($moyennesSemestres[0], 2) : 0,
                "moyenne_s2" => isset($moyennesSemestres[1]) ? round($moyennesSemestres[1], 2) : 0,
                "total_points" => round($totalPondereAnnuel, 2),
                "total_coefficients" => $totalCoeffAnnuel
            ];
            continue; 
        } else {
            
            $sql = "SELECT m.nom as matiere, 
                    AVG(n.valeur) as moyenne, 
                    COALESCE(cmc.coefficient, m.coefficient) as coefficient
                    FROM notes n
                    JOIN matieres m ON n.matiere_id = m.id
                    JOIN eleves e ON n.eleve_id = e.id
                    LEFT JOIN classe_matiere_coeff cmc ON (cmc.classe_id = e.classe_id AND cmc.matiere_id = m.id)
                    WHERE n.eleve_id = ? AND n.semestre_id = ? AND n.statut = 'VALIDE'
                    GROUP BY m.id";
            $stmtNotes = $pdo->prepare($sql);
            $stmtNotes->execute([$eleve_id, $semestre_id]);
            $notes = $stmtNotes->fetchAll(PDO::FETCH_ASSOC);
        }

        $totalPondere = 0;
        $totalCoeff = 0;
        foreach ($notes as &$n) {
            $n['moyenne'] = round($n['moyenne'], 2);
            $n['total_matiere'] = $n['moyenne'] * $n['coefficient'];
            $totalPondere += $n['total_matiere'];
            $totalCoeff += $n['coefficient'];
        }
        unset($n);

        $moyenneGenerale = $totalCoeff > 0 ? round($totalPondere / $totalCoeff, 2) : 0;

        $results[] = [
            "eleve" => $eleve,
            "notes" => $notes,
            "moyenne_generale" => $moyenneGenerale,
            "total_points" => round($totalPondere, 2),
            "total_coefficients" => $totalCoeff
        ];
    }

    echo json_encode([
        "success" => true,
        "bulletins" => $results,
        "type" => $type
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
