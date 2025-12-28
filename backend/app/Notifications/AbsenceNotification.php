<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AbsenceNotification extends Notification
{
    use Queueable;

    public function __construct(public string $course, public int $totalAbsences) {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Absence détectée')
            ->greeting('Salut cher parent')
            ->line('Votre enfant était absent au cours : ' . $this->course)
            ->line('C\'est sa ' . $this->totalAbsences . 'ème absence enregistrée.')
            ->line('Veuillez contacter l\'administration si besoin')
            ->salutation('Cordialement, l\'administration');
    }
}
