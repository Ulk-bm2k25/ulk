<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'presence';

    protected $fillable = ['classe_id', 'eleve_id', 'date', 'heure', 'present', 'justified', 'reason'];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }
}
