<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cours extends Model
{
    use HasFactory;

    protected $table = 'cours';

    protected $fillable = [
        'classe_id',
        'jour',
        'heure_debut',
        'heure_fin',
        'matiere',
        'enseignant',
        'matiere_id',
    ];

    protected $casts = [
        'heure_debut' => 'datetime:H:i',
        'heure_fin' => 'datetime:H:i',
    ];

    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    public function matiereModel(): BelongsTo
    {
        return $this->belongsTo(Matiere::class, 'matiere_id');
    }
}

