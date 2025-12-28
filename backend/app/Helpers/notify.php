<?php
use App\Models\Notification_Payment;
use App\Events\NotificationPaymentCreated;

if (!function_exists('notify')) {
    function notify(int $userId, string $title, string $content, string $type = 'system')
    {
        $notification_payment =  Notification_Payment::create([
            'user_id' => $userId,
            'title'   => $title,
            'content' => $content,
            'type'    => $type,
        ]);

        event(new NotificationPaymentCreated($notification_payment));
        return $notification_payment;
    }
}


        function notifyPaymentSuccess(int $userId, string $amount)
{
    return notify(
        $userId,
        "Paiement validé",
        "Votre paiement de $amount a été validé 🎉",
        "payment_success"
    );
}

function notifyPaymentFailed(int $userId, string $amount)
{
    return notify(
        $userId,
        "Paiement échoué",
        "Votre paiement de $amount n'a pas été validé ❌",
        "payment_failed"
    );
}

function notifyPaymentWaited(int $userId, string $amount)
{
    return notify(
        $userId,
        "Paiement en attente",
        "Votre paiement de $amount est en attente ⌚",
        "payment_waited"
    );
}

function notifyPaymentInfos(int $userId, string $amount)
{
    return notify(
        $userId,
        "Infomations Payment",
        "Les frais de scolarité sont disponibles dans le système et s'élèvent à $amount 💰 ",
        "payment_infos"
    );
}


function notifyPaymentRemboursement(int $userId, string $amount)
{
    return notify(
        $userId,
        "Remboursement",
        "Remboursement de $amount effectué avec succès  👌",
        "remboursement_infos"
    );
}
