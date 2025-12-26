<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Eleve extends Model
{
    protected $fillable = [
        'user_id',
        'classe_id',
        'serie_id',
        'sexe',
        'age',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function tuteurs()
    {
        return $this->belongsToMany(
            ParentTuteur::class,
            'relations_eleve_tuteur',
            'eleve_id',
            'tuteur_id'
        )->withPivot('relation_type');
    }

    public function carteScolarite()
    {
        return $this->hasOne(CarteScolarite::class);
    }
}