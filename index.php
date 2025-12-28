<?php
/**
 * PROJET : GROUPE 3
 * Ce fichier est le point d'entrée principal.
 * Il redirige automatiquement vers le Frontend (Vite/React).
 */

$page_accueil = 'frontend/index.html'; 

if (file_exists($page_accueil)) {
    // Redirection automatique vers l'interface du Groupe 3
    header("Location: $page_accueil");
    exit;
} else {
    // Message d'erreur propre
    echo "<!DOCTYPE html>
    <html lang='fr'>
    <head><meta charset='UTF-8'><title>Erreur - Groupe 3</title></head>
    <body style='font-family: Arial; text-align: center; margin-top: 50px;'>
        <h2 style='color: #d9534f;'>⚠️ Interface introuvable</h2>
        <p>Le fichier <strong>$page_accueil</strong> n'est pas accessible.</p>
        <p>Assurez-vous d'avoir installé les dépendances et lancé le projet.</p>
    </body>
    </html>";
}
?>
