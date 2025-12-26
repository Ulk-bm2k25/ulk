<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnneeScolaire extends Model
{
    protected $table = 'annee_scolaires';

    protected $fillable = [
        'annee',
        'date_debut',
        'date_fin',
    ];

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'annee_scolaire_id');
    }
}
