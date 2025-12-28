<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentEleve extends Model
{
    use HasFactory;

    protected $table = 'documents_eleves';

    protected $fillable = [
        'eleve_id',
        'type',
        'chemin_fichier',
        'nom_original',
        'date_upload',
    ];

    protected $casts = [
        'date_upload' => 'date',
    ];

    /**
     * Relation: Un document appartient à un élève
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class, 'eleve_id');
    }
}

