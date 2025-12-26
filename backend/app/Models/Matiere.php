<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'coefficient'];

    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'affectations');
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}
