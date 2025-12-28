<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seance extends Model
{
    use HasFactory;

    /**
     * Champs pouvant être assignés en masse
     */
    protected $fillable = [
        'course_id',    // Le cours concerné par la séance
        'date',         // Date de la séance
        'heure_debut',  // Heure de début
        'heure_fin',    // Heure de fin
    ];

    /**
     * Relation: une séance appartient à un cours
     *
     * @return BelongsTo
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Alias pour la relation 'course' (utilisé dans DashboardController)
     */
    public function cours(): BelongsTo
    {
        return $this->course();
    }

    /**
     * Relation: une séance peut avoir plusieurs présences
     *
     * @return HasMany
     */
    public function presences(): HasMany
    {
        return $this->hasMany(Presence::class, 'seance_id');
    }

    /**
     * Retourne la durée de la séance en minutes
     *
     * @return int
     */
    public function getDureeAttribute(): int
    {
        $debut = strtotime($this->heure_debut);
        $fin = strtotime($this->heure_fin);
        return ($fin - $debut) / 60;
    }

    /**
     * Vérifie si la séance est passée
     *
     * @return bool
     */
    public function isPast(): bool
    {
        return $this->date < now()->toDateString();
    }
}
