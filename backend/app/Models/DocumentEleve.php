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
        'classe_id',
        'course_id',
        'eleve_id',
        'type',
        'chemin_fichier',
        'nom_original',
        'date_upload',
    ];

    protected $casts = [
        'date_upload' => 'date',
    ];

    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class, 'eleve_id');
    }

    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}

