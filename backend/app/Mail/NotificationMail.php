<?php

namespace App\Mail;

use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Mailable pour les notifications email
 * 
 * Utilise un template Blade pour le rendu de l'email
 */
class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Créer une nouvelle instance du message.
     *
     * @param Notification $notification
     * @param string $subject
     * @param string $body
     */
    public function __construct(
        public Notification $notification,
        public string $subject,
        public string $body
    ) {
        // Le job gère la queue, donc pas besoin de ShouldQueue ici
    }

    /**
     * Obtenir l'enveloppe du message.
     *
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Obtenir la définition du contenu du message.
     *
     * @return Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notification',
            with: [
                'notification' => $this->notification,
                'subject' => $this->subject,
                'body' => $this->body,
            ],
        );
    }

    /**
     * Obtenir les pièces jointes du message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

