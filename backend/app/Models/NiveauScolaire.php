<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NiveauScolaire extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'description'];

    public function classes()
    {
        return $this->hasMany(Classe::class, 'niveau_id');
    }
}
