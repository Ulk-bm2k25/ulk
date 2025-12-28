<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Permission extends Model
{
    use HasFactory;

    /**
     * Le nom de la table dans la base de données
     */
    protected $table = 'permissions';

    /**
     * Les champs pouvant être assignés en masse
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'eleve_id',      // L'élève qui fait la demande
        'course_id',     // Le cours concerné
        'status',        // Statut: en_attente, approuvee, rejetee
        'raison',        // Optionnel: raison de la demande
        'commentaire',   // Optionnel: commentaire supplémentaire
        'date_demande',  // Date de la demande
        'absence_date',  // Date de l'absence demandée
        'attachment',    // Fichier justificatif (optionnel)
    ];

    /**
     * Relation: une permission appartient à un élève
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class, 'eleve_id');
    }

    /**
     * Relation: une permission concerne un cours
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Vérifie si la permission est approuvée
     *
     * @return bool
     */
    public function isApproved(): bool
    {
        return $this->status === 'approuvee';
    }

    /**
     * Vérifie si la permission est en attente
     *
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->status === 'en_attente';
    }

    /**
     * Vérifie si la permission est rejetée
     *
     * @return bool
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejetee';
    }

    /**
     * Retourne un libellé complet de la permission
     *
     * Exemple: "Permission pour le cours Mathématiques demandée par John Doe"
     *
     * @return string
     */
    public function getLabelAttribute(): string
    {
        return "Permission pour le cours " . ($this->course->matiere->nom ?? 'Inconnu') . " demandée par " . ($this->eleve->user->name ?? 'Inconnu');
    }
}
