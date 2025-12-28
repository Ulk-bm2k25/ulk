<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bulletin extends Model
{
    protected $fillable = ['eleve_id', 'annee_scolaire', 'moyenne', 'rang'];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }
}
