<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Eleve extends Model
{
    use HasFactory;

    protected $fillable = [
        'matricule',
        'user_id',
        'nom',
        'prenom',
        'genre',
        'date_naissance',
        'classe_id',
        'photo',
        'serie'
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    public function presences(): HasMany
    {
        return $this->hasMany(Presence::class);
    }
}