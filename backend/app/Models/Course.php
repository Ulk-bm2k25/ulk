<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'cours'; // si tu gardes le nom français

    protected $fillable = ['subject', 'classe_id', 'teacher_id'];

    // Relation avec la classe
    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    // Relation avec le professeur
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    // Relation avec les permissions
    public function permissions()
    {
        return $this->hasMany(Permission::class);
    }
    public function programmes()
    {
        return $this->hasMany(Programme::class);
    }

}
