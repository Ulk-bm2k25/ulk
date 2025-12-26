<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Eleve extends Model
{
    protected $fillable = [
        'user_id',
        'classe_id',
        'serie_id',
        'matricule',
        'photo',
        'sexe',
        'age',
        'date_naissance',
        'lieu_naissance',
        'adresse',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($eleve) {
            if (!$eleve->matricule) {
                $year = date('Y');
                $count = self::whereYear('created_at', $year)->count() + 1;
                $eleve->matricule = 'SH-' . $year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function tuteurs()
    {
        return $this->belongsToMany(
            ParentTuteur::class,
            'relations_eleve_tuteur',
            'eleve_id',
            'tuteur_id'
        )->withPivot('relation_type');
    }

    public function carteScolarite()
    {
        return $this->hasOne(CarteScolarite::class);
    }
}