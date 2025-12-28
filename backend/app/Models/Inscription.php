<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class Inscription extends Model
{
    protected $table = 'inscriptions';

    protected $fillable = [
        'eleve_id',
        'annee_scolaire_id',
        'date_inscription',
        'statut'
    ];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(AnneeScolaire::class, 'annee_scolaire_id');
    }

    public function fiche()
    {
        return $this->hasOne(FicheInscription::class);
    }
}