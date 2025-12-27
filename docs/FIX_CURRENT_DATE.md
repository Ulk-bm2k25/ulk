# Correction des Valeurs Par Défaut CURRENT_DATE

## Problème
Erreur MySQL : `SQLSTATE[42000]: Syntax error or access violation: 1064 Erreur de syntaxe près de 'CURRENT_DATE'`

## Cause
MySQL ne supporte pas `CURRENT_DATE` comme valeur par défaut pour les colonnes de type `date` dans certaines versions ou configurations. Seules les colonnes `timestamp` et `datetime` peuvent utiliser `CURRENT_TIMESTAMP`.

## Solution Appliquée
Toutes les colonnes `date` avec `default(DB::raw('CURRENT_DATE'))` ont été modifiées pour être `nullable()` à la place.

---

## ✅ Corrections Appliquées

### Colonnes DATE corrigées :

1. **`affectations_classes.date_affectation`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

2. **`cartes_scolarite.date_emission`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

3. **`inscriptions.date_inscription`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

4. **`remboursement.date_remboursement`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

5. **`paiement.date_paiement`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

6. **`evaluations.date_eval`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

7. **`notes.date_note`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

8. **`documents_eleves.upload_date`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

9. **`statistique_financiere.date_generation`**
   - Avant : `->default(DB::raw('CURRENT_DATE'))`
   - Après : `->nullable()`

### Colonnes TIMESTAMP (non modifiées - fonctionnent correctement) :

- `logs_activite.timestamp` : `->default(DB::raw('CURRENT_TIMESTAMP'))` ✅
- `notifications.date_envoi` : `->default(DB::raw('CURRENT_TIMESTAMP'))` ✅

---

## 📝 Notes

1. **Pourquoi nullable ?**
   - Les colonnes sont maintenant nullable, ce qui permet de les remplir manuellement dans le code
   - Vous pouvez utiliser `now()->toDateString()` ou `Carbon::now()->toDateString()` dans vos modèles/contrôleurs

2. **Alternative : Utiliser les Observers**
   - Vous pouvez créer des Observers Laravel pour définir automatiquement ces dates lors de la création des modèles

3. **Exemple dans un modèle :**
   ```php
   protected static function boot()
   {
       parent::boot();
       
       static::creating(function ($model) {
           if (empty($model->date_affectation)) {
               $model->date_affectation = now()->toDateString();
           }
       });
   }
   ```

---

## 🚀 Commandes

Réessayez la migration :
```bash
php artisan migrate:fresh
```

---

*Corrections appliquées le : Décembre 2025*

