<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once('db.php');

$data = json_decode(file_get_contents("php://input"));

if(!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Email et mot de passe requis."]);
    exit;
}

$email = $data->email;
$password = $data->password;

try {
    
    $stmt = $pdo->prepare("SELECT id, nom, prenom, email, mot_de_passe, role, doit_changer_mdp FROM users WHERE email = ?");

    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['mot_de_passe'])) {
        
        unset($user['mot_de_passe']); 
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Connexion réussie.",
            "user" => $user
        ]);
    } else {
        
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect."]);
    }
} catch (PDOException $e) {
    http_response_code(503);
    echo json_encode(["message" => "Erreur de service : " . $e->getMessage()]);
}
?>
