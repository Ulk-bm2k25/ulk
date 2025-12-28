<?php
require_once('db.php');
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = 'PARENT'");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['mot_de_passe'])) {
        
        $_SESSION['parent_id'] = $user['id'];
        $_SESSION['parent_nom'] = $user['nom'];
        
        
        header("Location: ../frontend/espace_parent.php");
    } else {
        echo "Identifiants incorrects ou vous n'êtes pas enregistré comme parent.";
    }
}
?>