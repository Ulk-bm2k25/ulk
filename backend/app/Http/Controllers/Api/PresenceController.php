<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presence extends Model
{
    use HasFactory;

    /**
     * Le nom de la table dans la base de données
     *
     * Par défaut, Laravel prend le pluriel du nom de la classe.
     * Si tu veux un autre nom, tu peux définir : protected $table = 'presences';
     */
    protected $table = 'presences';

    /**
     * Les champs pouvant être assignés en masse
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'seance_id', // La séance associée
        'eleve_id',  // L'élève concerné
        'statut',    // Statut de présence : present, absent, retard
    ];

    /**
     * Relation: une présence appartient à une séance
     *
     * @return BelongsTo
     */
    public function seance(): BelongsTo
    {
        return $this->belongsTo(Seance::class);
    }

    /**
     * Relation: une présence appartient à un élève
     *
     * @return BelongsTo
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Vérifie si l'élève est présent
     *
     * @return bool
     */
    public function isPresent(): bool
    {
        return $this->statut === 'present';
    }

    /**
     * Vérifie si l'élève est absent
     *
     * @return bool
     */
    public function isAbsent(): bool
    {
        return $this->statut === 'absent';
    }

    /**
     * Vérifie si l'élève est en retard
     *
     * @return bool
     */
    public function isLate(): bool
    {
        return $this->statut === 'retard';
    }

    /**
     * Retourne une description lisible de la présence
     *
     * Exemple: "John Doe est présent à la séance Mathématiques"
     *
     * @return string
     */
    public function getDescriptionAttribute(): string
    {
        return "{$this->eleve->nom_complet} est {$this->statut} à la séance {$this->seance->nom}";
    }
}
