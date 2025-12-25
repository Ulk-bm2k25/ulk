<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CarteScolarite extends Model
{
    protected $fillable = [
        'eleve_id',
        'numero_carte',
        'date_emission',
        'date_expiration',
        'statut'
    ];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }
}