<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AbsenceAlertNotification extends Notification
{
    use Queueable;
    protected string $eleveName;
    protected int $absenceCount;

    public function __construct(string $eleveName, int $absenceCount){
        //Nom de l'éleve
        $this->eleveName = $eleveName;
        // Nombre d'absences successives
        $this->absenceCount = $absenceCount;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Alerte absences successives')
            ->greeting('Salut cher parent,')
            ->line('Votre enfant ' . $this->eleveName . ' a accumulé ' . $this->absenceCount . ' absences au total.')
            ->line('Le seuil des 3 absences a été atteint ou dépassé, ce qui nécessite votre attention.')
            ->line('Une intervention est recommandée pour éviter des conséquences académiques.')
            ->line('Merci de contacter l\'administration.')
            ->salutation('Cordialement, L\'administration scolaire');
    }

    public function toArray($notifiable)
    {
        return [
            'eleve' => $this->eleveName,
            'absences' => $this->absenceCount
        ];
    }
}
