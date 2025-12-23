<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    // Colonnes autorisées en mass-assignment
    protected $fillable = ['seance_id', 'eleve_id', 'statut'];

    /**
     * Relation: chaque présence appartient à une séance
     */
    public function seance()
    {
        return $this->belongsTo(Seance::class);
    }

    /**
     * Relation: chaque présence appartient à un élève
     */
    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    /**
     * Vérifier si l'élève est présent
     */
    public function isPresent(): bool
    {
        return $this->statut === 'present';
    }
}
