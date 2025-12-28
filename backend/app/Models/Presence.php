<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    protected $table = 'presence';
    
    protected $fillable = [
        'classe_id',
        'course_id', 
        'eleve_id',
        'date',
        'heure',
        'present'
    ];

    public function eleve()
    {
        return $this->belongsTo(Eleve::class, 'eleve_id');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}