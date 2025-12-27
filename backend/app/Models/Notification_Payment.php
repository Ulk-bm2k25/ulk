<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification_Payment extends Model
{
    protected $table = 'notifications_payment';

       protected $fillable = [
        'user_id',
        'type',
        'title',
        'content',
        'is_read',
    ];
     protected $attributes = [
        'is_read' => false,
    ];
}
