<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['eleve_id', 'matiere_id', 'semestre_id', 'note', 'coefficient', 'appreciation'];

    protected $casts = [
        'note' => 'decimal:2',
        'coefficient' => 'integer'
    ];

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
