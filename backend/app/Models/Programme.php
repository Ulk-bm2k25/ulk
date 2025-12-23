<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'classe_id',
        'course_id',
        'teacher_id',
        'jour',
        'heure_debut',
        'heure_fin',
    ];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
