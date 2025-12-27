<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Serie extends Model
{
    use HasFactory;

    protected $table = 'series';

    protected $fillable = [
        'nom',
    ];

    /**
     * Relation: une série peut avoir plusieurs élèves
     */
    public function eleves(): HasMany
    {
        return $this->hasMany(Eleve::class, 'serie_id');
    }
}
