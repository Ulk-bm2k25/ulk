📊 Implémentation des Statistiques Financières – Récapitulatif Technique

🎯 Objectif
Afficher des statistiques en temps réel sur les paiements scolaires :
- Total encaissé
- Nombre de paiements
- Élèves ayant payé
- Répartition mensuelle
- Détail des derniers paiements

🧩 Architecture Technique
- Frontend
    - React + TypeScript + Tailwind CSS (via CDN)
    - Interface utilisateur (FinancialDashboard.tsx)
- Backend
    - Laravel 12 + PHP 8.5
    - API REST (/api/reports/financial/data)
- Base de données
    - MySQL (via XAMPP)
    - Stockage des données (paiement, users, etc.)

🔧 Étapes d’implémentation

1️⃣ Base de données (MySQL)

Tables utilisées :
    paiement → contient montant_paye, date_paiement, eleve_id, tranche_id
    eleves → lien avec users via user_id
    users → contient nom, prenom
    tranche_paiement et frais_type → pour la structure des frais
    Contrainte : frais_type n’est pas lié à classes → stats par classe désactivées

2️⃣ Backend Laravel
    Contrôleur créé :
        app/Http/Controllers/Api/FinancialReportController.php
    Route ajoutée :
        routes/api.php → GET /api/reports/financial/data
    Fonctionnalités :
        Agrégation des montants (SUM, COUNT, DISTINCT)
        Jointures entre paiement → eleves → users
        Retour JSON compatible avec le frontend

3️⃣ Frontend React
- Composant principal :
    src/components/FinancialDashboard.tsx
- Composant réutilisable :
    src/components/StatCard.tsx (cartes KPI)
Bibliothèques :
- lucide-react → icônes
- recharts → graphiques (camembert mensuel)
- Design :
    4 cartes KPI en haut
    Camembert mensuel en pleine largeur (car pas de stats par classe)
    Tableau des derniers paiements

4️⃣ Gestion des erreurs
    Si la base est vide → affichage du mock (données de démo)
    Si l’API échoue → fallback silencieux sur le mock
    CORS résolu via headers dans public/index.php (si nécessaire)

▶️ Comment exécuter le module
Prérequis
    XAMPP démarré (MySQL actif)
    Base de donnée importée avec les tables du Module 2
    Données de test insérées dans paiement (voir exemple ci-dessous)
Étapes

Lancer le backend :
    cd laravel-backend
    php artisan serve

Lancer le frontend :
    npm run dev -> Ouvre frontend/src/projet2/statistiques/index.html 
    URL : http://127.0.0.1:5500
Vérifier :
    Aller sur l’onglet "Statistiques Financières"
    Les données réelles s’affichent si la base n’est pas vide

- Données de test (SQL)

    -- 1. Frais type
    INSERT INTO `frais_type` (`nom`, `montant_defaut`, `est_obligatoire`)
    VALUES ('Scolarité 2025-2026', 500000.00, 1);

    -- 2. Tranche
    INSERT INTO `tranche_paiement` (`frais_type_id`, `numero`, `montant`, `date_echeance`, `statut`)
    VALUES (1, 1, 150000.00, '2025-10-15', 'paye');

    -- 3. Élève (user_id=12 doit exister)
    INSERT INTO `eleves` (`user_id`, `classe_id`, `serie_id`)
    VALUES (12, 1, 1);

    -- 4. Paiement
    INSERT INTO `paiement` (`eleve_id`, `tranche_id`, `montant_paye`, `mode_paiement`, `statut`, `date_paiement`)
    VALUES (1, 1, 150000.00, 'momo', 'paye', '2025-10-15');

⚠️ Limitations connues

Pas de statistiques par classe → frais_type n’a pas de classe_id
Nom de l’élève récupéré via users.nom + users.prenom
Dépendance aux données : sans lignes dans paiement, le dashboard affiche le mock

📁 Fichiers modifiés / créés
- Dossiers                      
laravel-backend/ -> app/Http/Controllers/Api/FinancialReportController.php
laravel-backend/ -> routes/api.php
frontend/src/components/ -> FinancialDashboard.tsx
frontend/src/components/ -> StatCard.tsx
frontend/src/projet2/statistiques/ -> App.tsx, main.tsx, index.html

✅ Validation
    API retourne du JSON valide (/api/reports/financial/data)
    Frontend affiche les KPI + camembert + tableau
    Données réelles → pas de mock
    Responsive et accessible

Note : Ce module est indépendant du reste de l’application. Il peut être intégré à tout moment via l’enum Vue.STATS_FINANCIERES.
