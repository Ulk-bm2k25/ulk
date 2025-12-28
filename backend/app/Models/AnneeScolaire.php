<?php

namespace App\Models;

<<<<<<< HEAD
use Illuminate\Database\Eloquent\Factories\HasFactory;
=======
>>>>>>> group-1
use Illuminate\Database\Eloquent\Model;

class AnneeScolaire extends Model
{
<<<<<<< HEAD
    use HasFactory;

=======
>>>>>>> group-1
    protected $table = 'annee_scolaires';

    protected $fillable = [
        'annee',
        'date_debut',
        'date_fin',
    ];
<<<<<<< HEAD
=======

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'annee_scolaire_id');
    }
>>>>>>> group-1
}
