<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semestre extends Model
{
    protected $fillable = ['nom', 'date_debut', 'date_fin'];

    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}
