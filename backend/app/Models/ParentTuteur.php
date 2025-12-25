<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParentTuteur extends Model
{
    protected $table = 'parents_tuteurs';

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'telephone',
        'email',
        'adresse',
        'profession'
    ];

    public function eleves()
    {
        return $this->belongsToMany(
            Eleve::class,
            'relations_eleve_tuteur',
            'tuteur_id',
            'eleve_id'
        )->withPivot('relation_type');
    }
}