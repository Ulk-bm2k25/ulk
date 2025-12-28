<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'message',
        'destinataire_id',
        'date_envoi',
        'lu'
    ];

    protected $casts = [
        'lu' => 'boolean',
        'date_envoi' => 'datetime',
    ];

    /**
     * L'expéditeur de la notification
     */
    public function expediteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Le destinataire de la notification
     */
    public function destinataire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'destinataire_id');
    }
}
