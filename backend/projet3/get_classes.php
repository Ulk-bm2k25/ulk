<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once('db.php');

try {
    $query = "SELECT id, nom FROM classes";
    $stmt = $pdo->query($query);
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    
    $ordre = ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'];
    
    usort($classes, function($a, $b) use ($ordre) {
        $getPos = function($name) use ($ordre) {
            foreach ($ordre as $index => $label) {
                if (stripos($name, $label) !== false) return $index;
            }
            return 99; 
        };
        
        $posA = $getPos($a['nom']);
        $posB = $getPos($b['nom']);
        
        if ($posA === $posB) {
            return strcasecmp($a['nom'], $b['nom']);
        }
        return $posA <=> $posB;
    });
    
    echo json_encode($classes);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>