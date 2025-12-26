<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'cours';
    
    protected $fillable = [
        'classe_id',
        'matiere_id',
        'enseignant_id',
        'jour',
        'heure_debut',
        'heure_fin',
        'salle'
    ];

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'matiere_id');
    }

    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class, 'enseignant_id');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'cours_id');
    }
}