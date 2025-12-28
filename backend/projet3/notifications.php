<?php


require_once('db.php');


function sendNotification($user_id, $message, $type = 'MAIL') {
    global $pdo;

    
    $sql = "INSERT INTO notifications (user_id, message, type, statut) VALUES (?, ?, ?, 'EN_ATTENTE')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id, $message, $type]);
    $notif_id = $pdo->lastInsertId();

    
    $success = false;

    if ($type === 'MAIL') {
        
        
        $success = true; 
    } elseif ($type === 'WHATSAPP') {
        
        $success = true; 
    }

    
    if ($success) {
        $pdo->prepare("UPDATE notifications SET statut = 'ENVOYE' WHERE id = ?")->execute([$notif_id]);
    } else {
        $pdo->prepare("UPDATE notifications SET statut = 'ECHEC' WHERE id = ?")->execute([$notif_id]);
    }

    return $success;
}


function notifyParentAboutNote($note_id) {
    global $pdo;

    $sql = "SELECT p.user_id as parent_user_id, u.nom as eleve_nom, n.valeur, m.nom as matiere
            FROM notes n
            JOIN eleves e ON n.eleve_id = e.id
            JOIN users u ON e.user_id = u.id
            JOIN matieres m ON n.matiere_id = m.id -- CETTE LIGNE EST ESSENTIELLE
            JOIN parent_eleve pe ON e.id = pe.eleve_id
            JOIN parents p ON pe.parent_id = p.id
            WHERE n.id = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$note_id]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        $msg = "Bonjour, une nouvelle note de " . $data['valeur'] . "/20 en " . $data['matiere'] . " a été publiée pour " . $data['eleve_nom'] . ".";
        sendNotification($data['parent_user_id'], $msg, 'MAIL');
        
    }
}
?>
