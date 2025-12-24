<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    protected $table = 'classes';

    protected $fillable = [
        'nom',
        'niveau_id',
        'description',
        'annee_scolaire'
    ];

    public function eleves()
    {
        return $this->hasMany(Eleve::class);
    }
}