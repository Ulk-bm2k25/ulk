<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolConfiguration extends Model
{
    use HasFactory;

    protected $table = 'school_configurations';

    protected $fillable = [
        'school_name',
        'school_acronym',
        'logo_path',
        'address',
        'phone',
        'email',
        'website',
        'description',
        'director_name',
        'director_signature_path',
        'additional_info',
    ];

    protected $casts = [
        'additional_info' => 'array',
    ];

    /**
     * Obtenir la configuration de l'école (singleton)
     */
    public static function getConfiguration()
    {
        return static::first() ?? static::create([
            'school_name' => 'École Primaire',
            'school_acronym' => 'EP',
        ]);
    }
}

