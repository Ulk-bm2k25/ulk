<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['eleve_id', 'matiere_id', 'semestre_id', 'valeur', 'date_note'];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function semestre()
    {
        return $this->belongsTo(Semestre::class);
    }
}
