<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FicheInscription extends Model
{
    protected $table = 'fiches_inscription';

    protected $fillable = [
        'inscription_id',
        'details',
        'url'
    ];

    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }
}