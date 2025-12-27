<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Responsable extends Model
{
    use HasFactory;

    /**
     * Le nom de la table dans la base de données
     */
    protected $table = 'responsables';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'fonction',
    ];

    /**
     * Relation: Un responsable appartient à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Vérifier si le responsable est un super admin
     */
    public function isSuperAdmin(): bool
    {
        return strtolower($this->fonction) === 'super administrateur';
    }

    /**
     * Vérifier si le responsable est un directeur
     */
    public function isDirecteur(): bool
    {
        return strtolower($this->fonction) === 'directeur';
    }
}