<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once('db.php');

$classe_id = $_GET['classe_id'] ?? null;
$semestre_id = $_GET['semestre_id'] ?? null;
$type = $_GET['type'] ?? 'semestre'; 

try {
    
    $query = "SELECT DISTINCT e.id, u.nom, u.prenom, c.nom as classe_nom 
              FROM eleves e 
              JOIN users u ON e.user_id = u.id
              JOIN classes c ON e.classe_id = c.id";
    $params = [];
    if ($classe_id) {
        $query .= " WHERE e.classe_id = ?";
        $params[] = $classe_id;
    }
    $query .= " GROUP BY e.id ORDER BY u.nom, u.prenom";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $eleves = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stats = [];

    foreach ($eleves as $eleve) {
        $eleve_id = $eleve['id'];

        if ($type === 'annuel') {
            $sql = "SELECT m.id, AVG(n.valeur) as moyenne, 
                    COALESCE(cmc.coefficient, m.coefficient) as coefficient
                    FROM notes n
                    JOIN matieres m ON n.matiere_id = m.id
                    JOIN eleves e ON n.eleve_id = e.id
                    LEFT JOIN classe_matiere_coeff cmc ON (cmc.classe_id = e.classe_id AND cmc.matiere_id = m.id)
                    WHERE n.eleve_id = ? AND n.statut = 'VALIDE'
                    GROUP BY m.id";
            $stmtNotes = $pdo->prepare($sql);
            $stmtNotes->execute([$eleve_id]);
        } else {
            $sql = "SELECT m.id, AVG(n.valeur) as moyenne, 
                    COALESCE(cmc.coefficient, m.coefficient) as coefficient
                    FROM notes n
                    JOIN matieres m ON n.matiere_id = m.id
                    JOIN eleves e ON n.eleve_id = e.id
                    LEFT JOIN classe_matiere_coeff cmc ON (cmc.classe_id = e.classe_id AND cmc.matiere_id = m.id)
                    WHERE n.eleve_id = ? AND n.semestre_id = ? AND n.statut = 'VALIDE'
                    GROUP BY m.id";
            $stmtNotes = $pdo->prepare($sql);
            $stmtNotes->execute([$eleve_id, $semestre_id]);
        }

        $notes = $stmtNotes->fetchAll(PDO::FETCH_ASSOC);

        $totalPondere = 0;
        $totalCoeff = 0;
        foreach ($notes as $n) {
            $totalPondere += $n['moyenne'] * $n['coefficient'];
            $totalCoeff += $n['coefficient'];
        }

        $moyenneGenerale = $totalCoeff > 0 ? round($totalPondere / $totalCoeff, 2) : 0;
        
        $stats[] = [
            "id" => $eleve['id'],
            "nom" => $eleve['nom'],
            "prenom" => $eleve['prenom'],
            "classe" => $eleve['classe_nom'],
            "moyenne" => $moyenneGenerale,
            "statut" => $moyenneGenerale >= 10 ? "ADMIS" : "REFUSÉ"
        ];
    }

    
    usort($stats, function($a, $b) {
        return $b['moyenne'] <=> $a['moyenne'];
    });

    
    $rank = 1;
    foreach ($stats as $index => &$s) {
        if ($index > 0 && $s['moyenne'] < $stats[$index - 1]['moyenne']) {
            $rank = $index + 1;
        }
        $s['rang'] = $rank;
    }
    unset($s); 

    
    $totalEleves = count($stats);
    $totalAdmis = 0;
    $totalRefuses = 0;
    $statsParClasse = [];
    
    foreach ($stats as $s) {
        if ($s['statut'] === 'ADMIS') {
            $totalAdmis++;
        } else {
            $totalRefuses++;
        }

        
        $cN = $s['classe'];
        if (!isset($statsParClasse[$cN])) {
            $statsParClasse[$cN] = [
                "classe" => $cN,
                "total" => 0,
                "admis" => 0,
                "refuses" => 0,
                "taux" => 0
            ];
        }
        $statsParClasse[$cN]['total']++;
        if ($s['statut'] === 'ADMIS') $statsParClasse[$cN]['admis']++;
        else $statsParClasse[$cN]['refuses']++;
    }

    
    foreach ($statsParClasse as &$cStat) {
        $cStat['taux'] = round(($cStat['admis'] / $cStat['total']) * 100, 1);
    }
    
    $tauxReussite = $totalEleves > 0 ? round(($totalAdmis / $totalEleves) * 100, 1) : 0;

    
    $ordreAcad = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'];
    $classesStats = array_values($statsParClasse);
    
    usort($classesStats, function($a, $b) use ($ordreAcad) {
        $getPos = function($name) use ($ordreAcad) {
            foreach ($ordreAcad as $idx => $label) {
                if (stripos($name, $label) !== false) return $idx;
            }
            return 99;
        };
        $posA = $getPos($a['classe']);
        $posB = $getPos($b['classe']);
        return ($posA === $posB) ? strcasecmp($a['classe'], $b['classe']) : $posA <=> $posB;
    });

    echo json_encode([
        "eleves" => $stats,
        "summary" => [
            "total_eleves" => $totalEleves,
            "total_admis" => $totalAdmis,
            "total_refuses" => $totalRefuses,
            "taux_reussite" => $tauxReussite,
            "classes" => $classesStats
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
