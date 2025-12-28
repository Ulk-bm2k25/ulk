<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'niveau_id', 'description', 'annee_scolaire'];

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
    public function niveau() 
    {
    return $this->belongsTo(NiveauScolaire::class, 'niveau_id');
    }
    public function getLibelleAttribute(): string
    {
        $niveauNom = isset($this->niveau->nom) ? $this->niveau->nom : 'N/A';
        return "{$this->nom} ({$niveauNom}) - {$this->annee_scolaire}";
// ...existing code...
    }

}