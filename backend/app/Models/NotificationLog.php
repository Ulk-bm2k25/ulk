<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle pour les logs des notifications
 * 
 * @property int $id
 * @property int $notification_id
 * @property string $event_type
 * @property string $recipient_email
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $clicked_url
 * @property \Illuminate\Support\Carbon $event_at
 * @property string|null $details
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 */
class NotificationLog extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notification_logs';

    /**
     * Types d'événements possibles
     */
    public const EVENT_SENT = 'sent';
    public const EVENT_DELIVERED = 'delivered';
    public const EVENT_OPENED = 'opened';
    public const EVENT_CLICKED = 'clicked';
    public const EVENT_BOUNCED = 'bounced';
    public const EVENT_FAILED = 'failed';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'notification_id',
        'event_type',
        'recipient_email',
        'ip_address',
        'user_agent',
        'clicked_url',
        'event_at',
        'details',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_at' => 'datetime',
        ];
    }

    /**
     * Relation: Un log appartient à une notification
     *
     * @return BelongsTo
     */
    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class, 'notification_id');
    }

    /**
     * Scope pour filtrer par type d'événement
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $eventType
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeEventType($query, string $eventType)
    {
        return $query->where('event_type', $eventType);
    }

    /**
     * Scope pour les événements d'ouverture
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOpened($query)
    {
        return $query->where('event_type', self::EVENT_OPENED);
    }

    /**
     * Scope pour les événements de clic
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeClicked($query)
    {
        return $query->where('event_type', self::EVENT_CLICKED);
    }

    /**
     * Créer un log d'envoi
     *
     * @param int $notificationId
     * @param string $recipientEmail
     * @return static
     */
    public static function createSentLog(int $notificationId, string $recipientEmail): self
    {
        return self::create([
            'notification_id' => $notificationId,
            'event_type' => self::EVENT_SENT,
            'recipient_email' => $recipientEmail,
            'event_at' => now(),
        ]);
    }

    /**
     * Créer un log d'ouverture
     *
     * @param int $notificationId
     * @param string $recipientEmail
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return static
     */
    public static function createOpenedLog(
        int $notificationId,
        string $recipientEmail,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): self {
        return self::create([
            'notification_id' => $notificationId,
            'event_type' => self::EVENT_OPENED,
            'recipient_email' => $recipientEmail,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'event_at' => now(),
        ]);
    }

    /**
     * Créer un log de clic
     *
     * @param int $notificationId
     * @param string $recipientEmail
     * @param string $clickedUrl
     * @param string|null $ipAddress
     * @param string|null $userAgent
     * @return static
     */
    public static function createClickedLog(
        int $notificationId,
        string $recipientEmail,
        string $clickedUrl,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): self {
        return self::create([
            'notification_id' => $notificationId,
            'event_type' => self::EVENT_CLICKED,
            'recipient_email' => $recipientEmail,
            'clicked_url' => $clickedUrl,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'event_at' => now(),
        ]);
    }
}

