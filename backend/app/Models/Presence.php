<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presence extends Model
{
    protected $table = 'presence';
    use HasFactory;

    protected $fillable = [
        'eleve_id',
        'date',
        'statut',
        'justifie',
        'motif',
    ];

    protected $casts = [
        'date' => 'date',
        'justifie' => 'boolean',
    ];

    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class);
    }
}