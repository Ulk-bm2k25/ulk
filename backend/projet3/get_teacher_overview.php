<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once('db.php');

$user_id = $_GET['user_id'] ?? null;
$semestre_id = $_GET['semestre_id'] ?? null;

if (!$user_id) {
    echo json_encode(["error" => "ID utilisateur manquant"]);
    exit;
}

try {
    
    $sqlEns = "SELECT e.id as enseignant_id, e.matiere, GROUP_CONCAT(ec.classe_id) as classes_ids
               FROM enseignants e
               LEFT JOIN enseignant_classe ec ON e.id = ec.enseignant_id
               WHERE e.user_id = ?
               GROUP BY e.id";
    $stmtEns = $pdo->prepare($sqlEns);
    $stmtEns->execute([$user_id]);
    $ensInfo = $stmtEns->fetch(PDO::FETCH_ASSOC);

    if (!$ensInfo) {
        echo json_encode(["error" => "Enseignant non trouvé"]);
        exit;
    }

    $matiere_nom = $ensInfo['matiere'];
    $classes_ids = $ensInfo['classes_ids'] ? explode(',', $ensInfo['classes_ids']) : [];

    if (empty($classes_ids)) {
        echo json_encode(["classes" => [], "message" => "Aucune classe affectée"]);
        exit;
    }

    
    $overview = [];

    foreach ($classes_ids as $c_id) {
        $stmtC = $pdo->prepare("SELECT nom FROM classes WHERE id = ?");
        $stmtC->execute([$c_id]);
        $classe_nom = $stmtC->fetchColumn();

        
        $sqlEleves = "SELECT e.id, u.nom, u.prenom 
                      FROM eleves e
                      JOIN users u ON e.user_id = u.id
                      WHERE e.classe_id = ?
                      ORDER BY u.nom, u.prenom";
        $stmtEleves = $pdo->prepare($sqlEleves);
        $stmtEleves->execute([$c_id]);
        $elevesList = $stmtEleves->fetchAll(PDO::FETCH_ASSOC);

        
        $targets = [];
        // Détection plus robuste des matières multiples (avec ou sans espaces, /, et, +)
        $targets = [];
        // Supporte "Matiere 1 / Matiere 2", "Matiere 1 et Matiere 2", "Matiere 1, Matiere 2"
        $subjects = preg_split('/(\s+\/\s+|\s+et\s+|\s*\+\s*|\s*,\s*)/i', $matiere_nom, -1, PREG_SPLIT_NO_EMPTY);
        
        if (count($subjects) > 1) {
            foreach ($subjects as $sub) {
                $subName = trim($sub);
                $targets[] = [
                    'nom' => $subName,
                    'suffix' => ' (' . $subName . ')'
                ];
            }
        } else {
            $targets = [['nom' => $matiere_nom, 'suffix' => '']];
        }

        foreach ($targets as $target) {
            $stmtMat = $pdo->prepare("SELECT id FROM matieres WHERE nom = ?");
            $stmtMat->execute([$target['nom']]);
            $matiere_id = $stmtMat->fetchColumn();

            if (!$matiere_id) continue;

            $statsEleves = [];
            foreach ($elevesList as $eleve) {
                $notesSql = "SELECT valeur, type_evaluation, numero_evaluation 
                            FROM notes 
                            WHERE eleve_id = ? AND matiere_id = ? AND statut = 'VALIDE'";
                $paramsNotes = [$eleve['id'], $matiere_id];
                
                if ($semestre_id) {
                    $notesSql .= " AND semestre_id = ?";
                    $paramsNotes[] = $semestre_id;
                }

                $stmtN = $pdo->prepare($notesSql);
                $stmtN->execute($paramsNotes);
                $allNotes = $stmtN->fetchAll(PDO::FETCH_ASSOC);

                $formattedNotes = [
                    'D1' => null, 'D2' => null, 'D3' => null,
                    'I1' => null, 'I2' => null, 'I3' => null,
                    'E1' => null
                ];
                $sum = 0; $count = 0;
                foreach ($allNotes as $n) {
                    $key = ($n['type_evaluation'] === 'DEVOIR' ? 'D' : ($n['type_evaluation'] === 'COMPOSITION' ? 'E' : 'I')) . $n['numero_evaluation'];
                    $formattedNotes[$key] = $n['valeur'];
                    $sum += $n['valeur'];
                    $count++;
                }

                $moyenne = $count > 0 ? round($sum / $count, 2) : 0;

                $statsEleves[] = [
                    "eleve" => $eleve['prenom'] . ' ' . $eleve['nom'],
                    "notes" => $formattedNotes,
                    "moyenne" => $moyenne
                ];
            }

            $overview[] = [
                "classe_id" => $c_id,
                "classe_nom" => $classe_nom . $target['suffix'],
                "matiere" => $target['nom'],
                "eleves" => $statsEleves
            ];
        }
    }

    echo json_encode($overview);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
