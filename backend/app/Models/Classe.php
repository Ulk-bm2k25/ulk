<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Classe extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'niveau_id', 'description', 'serie', 'annee_scolaire', 'effectif_max', 'current_students'];

    public function niveauScolaire()
    {
        return $this->belongsTo(NiveauScolaire::class, 'niveau_id');
    }

    public function eleves()
    {
        return $this->belongsToMany(Eleve::class, 'affectations');
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'affectations');
    }

    public function enseignants()
    {
        return $this->belongsToMany(User::class, 'affectations', 'class_id', 'user_id')->where('role', 'ENSEIGNANT');
    }

    public function isFull()
    {
        return $this->current_students >= $this->capacity_max;
    }

    public function incrementStudents()
    {
        $this->increment('current_students');
    }

    public function decrementStudents()
    {
        $this->decrement('current_students');
    }

    
}
