<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Mail\NotificationMail;
use App\Models\NotificationLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Exception;

/**
 * Job pour envoyer une notification par email de manière asynchrone
 * 
 * Ce job est mis en queue et traité par le worker de queue.
 * Il inclut la logique de retry et le logging complet des envois.
 */
class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Le nombre de fois que le job peut être tenté.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Le nombre de secondes à attendre avant de retenter le job.
     *
     * @var int
     */
    public $backoff = [60, 300, 900]; // 1 min, 5 min, 15 min

    /**
     * Le nombre de secondes après lesquelles le job sera considéré comme ayant échoué.
     *
     * @var int
     */
    public $timeout = 120;

    /**
     * Créer une nouvelle instance du job.
     *
     * @param Notification $notification
     */
    public function __construct(
        public Notification $notification
    ) {
        // Mettre le job dans la queue 'emails'
        $this->onQueue('emails');
    }

    /**
     * Exécuter le job.
     *
     * @return void
     */
    public function handle(): void
    {
        try {
            // Vérifier que la notification est bien en statut scheduled
            if (!$this->notification->isScheduled()) {
                Log::warning('Tentative d\'envoi d\'une notification non programmée', [
                    'notification_id' => $this->notification->id,
                    'status' => $this->notification->status,
                ]);
                return;
            }

            // Récupérer le destinataire
            $recipient = $this->notification->recipient;

            if (!$recipient) {
                throw new Exception('Destinataire introuvable');
            }

            if (!$recipient->email) {
                throw new Exception('Email du destinataire manquant');
            }

            // Créer le mailable
            $mail = new NotificationMail(
                $this->notification,
                $this->notification->subject,
                $this->notification->body
            );

            // Envoyer l'email
            Mail::to($recipient->email)
                ->send($mail);

            // Marquer comme envoyée
            $this->notification->markAsSent();

            // Logger l'envoi
            NotificationLog::createSentLog(
                $this->notification->id,
                $recipient->email
            );

            Log::info('Notification envoyée avec succès', [
                'notification_id' => $this->notification->id,
                'recipient_email' => $recipient->email,
            ]);

        } catch (Exception $e) {
            // Logger l'erreur
            Log::error('Erreur lors de l\'envoi de la notification', [
                'notification_id' => $this->notification->id,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            // Si c'est le dernier essai, marquer comme échouée
            if ($this->attempts() >= $this->tries) {
                $this->notification->markAsFailed($e->getMessage());

                // Logger l'échec
                NotificationLog::create([
                    'notification_id' => $this->notification->id,
                    'event_type' => NotificationLog::EVENT_FAILED,
                    'recipient_email' => $this->notification->recipient->email ?? 'unknown',
                    'details' => json_encode([
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]),
                    'event_at' => now(),
                ]);
            }

            // Relancer l'exception pour que le job soit retenté
            throw $e;
        }
    }

    /**
     * Gérer un échec du job.
     *
     * @param Exception $exception
     * @return void
     */
    public function failed(Exception $exception): void
    {
        // Le job a échoué après tous les essais
        $this->notification->markAsFailed($exception->getMessage());

        Log::error('Job d\'envoi de notification définitivement échoué', [
            'notification_id' => $this->notification->id,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts(),
        ]);
    }
}

