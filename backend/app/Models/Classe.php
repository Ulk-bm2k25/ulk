<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    // Fusion des champs des deux versions
    protected $fillable = [
        'nom',
        'niveau_id',
        'description',
        'annee_scolaire',
        'capacity_max',
        'current_students',
    ];

    public function eleves()
    {
        return $this->hasMany(Eleve::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function programmes()
    {
        return $this->hasMany(Programme::class);
    }

    // Relation standard vers NiveauScolaire (nommage unique conservé)
    public function niveau()
    {
        return $this->belongsTo(NiveauScolaire::class, 'niveau_id');
    }

    // Libellé sûr : évite les erreurs quand niveau est null
    public function getLibelleAttribute(): string
    {
        $niveauNom = $this->niveau && isset($this->niveau->nom) ? $this->niveau->nom : 'N/A';
        return "{$this->nom} ({$niveauNom}) - {$this->annee_scolaire}";
    }
}