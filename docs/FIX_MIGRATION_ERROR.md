# Correction de l'Erreur de Migration MySQL

## Problème
Erreur lors de l'exécution de `php artisan migrate` :
```
SQLSTATE[42000]: Syntax error or access violation: 1071 
La clé est trop longue. Longueur maximale: 1000
```

## Cause
Avec MySQL et le charset `utf8mb4` (4 octets par caractère), les colonnes `string` sans longueur spécifiée créent des `VARCHAR(255)`. Quand ces colonnes ont des index uniques ou primaires, la taille de l'index peut dépasser la limite de 1000 octets de MySQL (255 * 4 = 1020 octets > 1000).

## Solution Appliquée
Limitation de la longueur des colonnes `string` avec index uniques/primaires à **191 caractères maximum** (191 * 4 = 764 octets < 1000).

### Migrations Corrigées

1. **0001_01_01_000000_create_users_table.php**
   - `email` : `string('email', 191)->unique()`
   - `password_reset_tokens.email` : `string('email', 191)->primary()`
   - `sessions.id` : `string('id', 191)->primary()`

2. **0001_01_01_000001_create_cache_table.php**
   - `cache.key` : `string('key', 191)->primary()`
   - `cache_locks.key` : `string('key', 191)->primary()`

3. **0001_01_01_000002_create_jobs_table.php**
   - `job_batches.id` : `string('id', 191)->primary()`
   - `failed_jobs.uuid` : `string('uuid', 191)->unique()`

4. **2024_01_01_create_tables.php**
   - `matricule` : `string('matricule', 100)->unique()`
   - `numero_dossier` : `string('numero_dossier', 100)->unique()`
   - `reference` : `string('reference', 100)->unique()`

5. **2025_12_17_161120_create_niveaux_scolaires_table.php**
   - `nom` : `string('nom', 191)->unique()`

6. **2025_12_17_162439_create_cartes_scolarite_table.php**
   - `numero_carte` : `string('numero_carte', 100)->unique()`

## Commandes à Exécuter

Si vous avez déjà tenté la migration et qu'elle a échoué :

```bash
# Option 1 : Réinitialiser complètement (⚠️ Supprime toutes les données)
php artisan migrate:fresh

# Option 2 : Rollback puis re-migrate (si vous avez des données importantes)
php artisan migrate:rollback
php artisan migrate
```

## Vérification

Après la correction, exécutez :
```bash
php artisan migrate
```

La migration devrait maintenant s'exécuter sans erreur.

## Notes

- **191 caractères** est la longueur maximale recommandée pour les colonnes avec index unique en utf8mb4
- **100 caractères** est suffisant pour les codes/numéros (matricule, référence, etc.)
- Cette limitation n'affecte pas la fonctionnalité de l'application car :
  - Les emails font rarement plus de 191 caractères
  - Les codes/numéros sont généralement courts
  - Les noms de niveaux scolaires sont courts

---

*Correction appliquée le : Décembre 2025*

