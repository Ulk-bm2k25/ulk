<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\NotificationTemplate;
use App\Models\User;
use App\Jobs\SendNotificationJob;
use Illuminate\Support\Facades\Log;

/**
 * Service principal pour la gestion des notifications
 * 
 * Ce service gère l'envoi de notifications par email aux parents :
 * - Rappels de paiement des frais de scolarité
 * - Informations urgentes concernant leurs enfants
 * - Notifications générales de l'école
 */
class NotificationService
{
    /**
     * Envoyer un rappel de paiement à un parent
     *
     * @param User $recipient Parent destinataire
     * @param array $data Données du paiement (montant, échéance, tranche, etc.)
     * @param User|null $sender Expéditeur (admin, optionnel)
     * @param \DateTimeInterface|null $scheduledAt Date d'envoi programmée (optionnel)
     * @return Notification
     * @throws \Exception
     */
    public function sendPaymentReminder(
        User $recipient,
        array $data,
        ?User $sender = null,
        ?\DateTimeInterface $scheduledAt = null
    ): Notification {
        // Validation des données requises
        $this->validatePaymentData($data);

        // Récupérer le template de rappel de paiement
        $template = NotificationTemplate::active()
            ->ofType(Notification::TYPE_PAYMENT_REMINDER)
            ->first();

        if (!$template) {
            throw new \Exception('Template de rappel de paiement introuvable ou inactif');
        }

        // Préparer les données pour le template
        $templateData = [
            'parent_name' => $recipient->name,
            'amount' => number_format($data['amount'] ?? 0, 2, ',', ' '),
            'due_date' => isset($data['due_date']) 
                ? \Carbon\Carbon::parse($data['due_date'])->format('d/m/Y') 
                : 'N/A',
            'tranche' => $data['tranche'] ?? 'N/A',
            'student_name' => $data['student_name'] ?? 'Votre enfant',
        ];

        // Rendre le template
        $subject = $template->renderSubject($templateData);
        $body = $template->render($templateData);

        // Créer la notification
        $notification = Notification::create([
            'template_id' => $template->id,
            'recipient_id' => $recipient->id,
            'sender_id' => $sender?->id,
            'subject' => $subject,
            'body' => $body,
            'status' => $scheduledAt ? Notification::STATUS_SCHEDULED : Notification::STATUS_DRAFT,
            'type' => Notification::TYPE_PAYMENT_REMINDER,
            'scheduled_at' => $scheduledAt,
            'metadata' => $data,
        ]);

        // Si pas de date programmée, envoyer immédiatement
        if (!$scheduledAt) {
            $this->queueNotification($notification);
        }

        Log::info('Rappel de paiement créé', [
            'notification_id' => $notification->id,
            'recipient_id' => $recipient->id,
            'scheduled_at' => $scheduledAt?->format('Y-m-d H:i:s'),
        ]);

        return $notification;
    }

    /**
     * Envoyer une notification urgente à un parent
     *
     * @param User $recipient Parent destinataire
     * @param string $subject Sujet de l'email
     * @param string $body Corps du message
     * @param array $metadata Données supplémentaires (optionnel)
     * @param User|null $sender Expéditeur (admin, optionnel)
     * @return Notification
     */
    public function sendUrgentNotification(
        User $recipient,
        string $subject,
        string $body,
        array $metadata = [],
        ?User $sender = null
    ): Notification {
        // Créer la notification urgente
        $notification = Notification::create([
            'recipient_id' => $recipient->id,
            'sender_id' => $sender?->id,
            'subject' => $subject,
            'body' => $body,
            'status' => Notification::STATUS_DRAFT,
            'type' => Notification::TYPE_URGENT_INFO,
            'metadata' => $metadata,
        ]);

        // Envoyer immédiatement (urgent)
        $this->queueNotification($notification);

        Log::info('Notification urgente créée et envoyée', [
            'notification_id' => $notification->id,
            'recipient_id' => $recipient->id,
        ]);

        return $notification;
    }

    /**
     * Envoyer une notification générale
     *
     * @param User $recipient Parent destinataire
     * @param string $subject Sujet de l'email
     * @param string $body Corps du message
     * @param array $metadata Données supplémentaires (optionnel)
     * @param User|null $sender Expéditeur (admin, optionnel)
     * @param \DateTimeInterface|null $scheduledAt Date d'envoi programmée (optionnel)
     * @return Notification
     */
    public function sendGeneralNotification(
        User $recipient,
        string $subject,
        string $body,
        array $metadata = [],
        ?User $sender = null,
        ?\DateTimeInterface $scheduledAt = null
    ): Notification {
        // Créer la notification générale
        $notification = Notification::create([
            'recipient_id' => $recipient->id,
            'sender_id' => $sender?->id,
            'subject' => $subject,
            'body' => $body,
            'status' => $scheduledAt ? Notification::STATUS_SCHEDULED : Notification::STATUS_DRAFT,
            'type' => Notification::TYPE_GENERAL,
            'scheduled_at' => $scheduledAt,
            'metadata' => $metadata,
        ]);

        // Si pas de date programmée, envoyer immédiatement
        if (!$scheduledAt) {
            $this->queueNotification($notification);
        }

        Log::info('Notification générale créée', [
            'notification_id' => $notification->id,
            'recipient_id' => $recipient->id,
            'scheduled_at' => $scheduledAt?->format('Y-m-d H:i:s'),
        ]);

        return $notification;
    }

    /**
     * Envoyer une notification en utilisant un template
     *
     * @param User $recipient Parent destinataire
     * @param string $templateName Nom du template
     * @param array $templateData Données pour remplir le template
     * @param array $metadata Données supplémentaires (optionnel)
     * @param User|null $sender Expéditeur (admin, optionnel)
     * @param \DateTimeInterface|null $scheduledAt Date d'envoi programmée (optionnel)
     * @return Notification
     * @throws \Exception
     */
    public function sendWithTemplate(
        User $recipient,
        string $templateName,
        array $templateData,
        array $metadata = [],
        ?User $sender = null,
        ?\DateTimeInterface $scheduledAt = null
    ): Notification {
        // Récupérer le template
        $template = NotificationTemplate::active()
            ->where('name', $templateName)
            ->first();

        if (!$template) {
            throw new \Exception("Template '{$templateName}' introuvable ou inactif");
        }

        // Rendre le template
        $subject = $template->renderSubject($templateData);
        $body = $template->render($templateData);

        // Créer la notification
        $notification = Notification::create([
            'template_id' => $template->id,
            'recipient_id' => $recipient->id,
            'sender_id' => $sender?->id,
            'subject' => $subject,
            'body' => $body,
            'status' => $scheduledAt ? Notification::STATUS_SCHEDULED : Notification::STATUS_DRAFT,
            'type' => $template->type,
            'scheduled_at' => $scheduledAt,
            'metadata' => array_merge($metadata, $templateData),
        ]);

        // Si pas de date programmée, envoyer immédiatement
        if (!$scheduledAt) {
            $this->queueNotification($notification);
        }

        Log::info('Notification envoyée avec template', [
            'notification_id' => $notification->id,
            'template_name' => $templateName,
            'recipient_id' => $recipient->id,
        ]);

        return $notification;
    }

    /**
     * Mettre en queue une notification pour envoi
     *
     * @param Notification $notification
     * @return void
     */
    protected function queueNotification(Notification $notification): void
    {
        // Marquer comme scheduled si pas déjà le cas
        if ($notification->status === Notification::STATUS_DRAFT) {
            $notification->update(['status' => Notification::STATUS_SCHEDULED]);
        }

        // Dispatch le job
        SendNotificationJob::dispatch($notification);
    }

    /**
     * Valider les données de paiement
     *
     * @param array $data
     * @return void
     * @throws \Exception
     */
    protected function validatePaymentData(array $data): void
    {
        $required = ['amount'];

        foreach ($required as $field) {
            if (!isset($data[$field])) {
                throw new \Exception("Le champ '{$field}' est requis pour un rappel de paiement");
            }
        }
    }

    /**
     * Obtenir les statistiques d'une notification
     *
     * @param Notification $notification
     * @return array
     */
    public function getNotificationStats(Notification $notification): array
    {
        $logs = $notification->logs;

        return [
            'sent' => $logs->where('event_type', 'sent')->count(),
            'delivered' => $logs->where('event_type', 'delivered')->count(),
            'opened' => $logs->where('event_type', 'opened')->count(),
            'clicked' => $logs->where('event_type', 'clicked')->count(),
            'bounced' => $logs->where('event_type', 'bounced')->count(),
            'failed' => $logs->where('event_type', 'failed')->count(),
            'first_opened_at' => $logs->where('event_type', 'opened')->first()?->event_at,
            'last_opened_at' => $logs->where('event_type', 'opened')->last()?->event_at,
        ];
    }

    /**
     * Relancer une notification échouée
     *
     * @param Notification $notification
     * @return bool
     */
    public function retryFailedNotification(Notification $notification): bool
    {
        if (!$notification->isFailed()) {
            return false;
        }

        // Réinitialiser le statut
        $notification->update([
            'status' => Notification::STATUS_SCHEDULED,
            'error_message' => null,
        ]);

        // Remettre en queue
        $this->queueNotification($notification);

        Log::info('Notification échouée relancée', [
            'notification_id' => $notification->id,
        ]);

        return true;
    }

    /**
     * Obtenir les notifications programmées à envoyer
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getScheduledNotifications()
    {
        return Notification::scheduled()->get();
    }
}

