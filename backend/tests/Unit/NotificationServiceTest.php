<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Notification;
use App\Models\NotificationTemplate;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;

/**
 * Tests unitaires pour NotificationService
 */
class NotificationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected NotificationService $notificationService;

    /**
     * Configuration avant chaque test
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->notificationService = new NotificationService();
        
        // Créer un template de test
        NotificationTemplate::create([
            'name' => 'payment_reminder_test',
            'subject' => 'Rappel de paiement - {{tranche}}',
            'body' => 'Bonjour {{parent_name}}, montant: {{amount}}',
            'type' => 'payment_reminder',
            'is_active' => true,
        ]);
    }

    /**
     * Test: Envoyer un rappel de paiement
     */
    public function test_send_payment_reminder(): void
    {
        Queue::fake();

        $recipient = User::factory()->create();
        
        $data = [
            'amount' => 150000,
            'due_date' => '2024-01-15',
            'tranche' => 'Tranche 1',
            'student_name' => 'Jean Dupont',
        ];

        $notification = $this->notificationService->sendPaymentReminder(
            $recipient,
            $data
        );

        $this->assertInstanceOf(Notification::class, $notification);
        $this->assertEquals(Notification::TYPE_PAYMENT_REMINDER, $notification->type);
        $this->assertEquals($recipient->id, $notification->recipient_id);
        $this->assertNotNull($notification->subject);
        $this->assertNotNull($notification->body);
        
        // Vérifier que le job a été dispatché
        Queue::assertPushed(\App\Jobs\SendNotificationJob::class);
    }

    /**
     * Test: Envoyer un rappel de paiement avec date programmée
     */
    public function test_send_payment_reminder_scheduled(): void
    {
        Queue::fake();

        $recipient = User::factory()->create();
        $scheduledAt = now()->addDays(1);
        
        $data = [
            'amount' => 150000,
            'due_date' => '2024-01-15',
            'tranche' => 'Tranche 1',
        ];

        $notification = $this->notificationService->sendPaymentReminder(
            $recipient,
            $data,
            null,
            $scheduledAt
        );

        $this->assertEquals(Notification::STATUS_SCHEDULED, $notification->status);
        $this->assertEquals($scheduledAt->format('Y-m-d H:i:s'), $notification->scheduled_at->format('Y-m-d H:i:s'));
        
        // Le job ne doit pas être dispatché immédiatement si programmé
        Queue::assertNothingPushed();
    }

    /**
     * Test: Envoyer un rappel de paiement sans template
     */
    public function test_send_payment_reminder_without_template(): void
    {
        NotificationTemplate::where('type', 'payment_reminder')->delete();

        $recipient = User::factory()->create();
        
        $data = [
            'amount' => 150000,
        ];

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Template de rappel de paiement introuvable ou inactif');

        $this->notificationService->sendPaymentReminder($recipient, $data);
    }

    /**
     * Test: Envoyer une notification urgente
     */
    public function test_send_urgent_notification(): void
    {
        Queue::fake();

        $recipient = User::factory()->create();
        $sender = User::factory()->create();

        $notification = $this->notificationService->sendUrgentNotification(
            $recipient,
            'Sujet urgent',
            'Message urgent',
            ['priority' => 'high'],
            $sender
        );

        $this->assertInstanceOf(Notification::class, $notification);
        $this->assertEquals(Notification::TYPE_URGENT_INFO, $notification->type);
        $this->assertEquals('Sujet urgent', $notification->subject);
        $this->assertEquals('Message urgent', $notification->body);
        $this->assertEquals($sender->id, $notification->sender_id);
        
        // Vérifier que le job a été dispatché (urgent = immédiat)
        Queue::assertPushed(\App\Jobs\SendNotificationJob::class);
    }

    /**
     * Test: Envoyer une notification générale
     */
    public function test_send_general_notification(): void
    {
        Queue::fake();

        $recipient = User::factory()->create();

        $notification = $this->notificationService->sendGeneralNotification(
            $recipient,
            'Sujet général',
            'Message général'
        );

        $this->assertInstanceOf(Notification::class, $notification);
        $this->assertEquals(Notification::TYPE_GENERAL, $notification->type);
        
        Queue::assertPushed(\App\Jobs\SendNotificationJob::class);
    }

    /**
     * Test: Obtenir les statistiques d'une notification
     */
    public function test_get_notification_stats(): void
    {
        $recipient = User::factory()->create();
        
        $notification = Notification::create([
            'recipient_id' => $recipient->id,
            'subject' => 'Test',
            'body' => 'Test body',
            'status' => Notification::STATUS_SENT,
            'type' => Notification::TYPE_GENERAL,
            'sent_at' => now(),
        ]);

        // Créer des logs
        \App\Models\NotificationLog::create([
            'notification_id' => $notification->id,
            'event_type' => 'sent',
            'recipient_email' => $recipient->email,
            'event_at' => now(),
        ]);

        \App\Models\NotificationLog::create([
            'notification_id' => $notification->id,
            'event_type' => 'opened',
            'recipient_email' => $recipient->email,
            'event_at' => now(),
        ]);

        $stats = $this->notificationService->getNotificationStats($notification);

        $this->assertEquals(1, $stats['sent']);
        $this->assertEquals(1, $stats['opened']);
        $this->assertEquals(0, $stats['clicked']);
    }

    /**
     * Test: Relancer une notification échouée
     */
    public function test_retry_failed_notification(): void
    {
        Queue::fake();

        $recipient = User::factory()->create();
        
        $notification = Notification::create([
            'recipient_id' => $recipient->id,
            'subject' => 'Test',
            'body' => 'Test body',
            'status' => Notification::STATUS_FAILED,
            'type' => Notification::TYPE_GENERAL,
            'error_message' => 'Erreur test',
        ]);

        $result = $this->notificationService->retryFailedNotification($notification);

        $this->assertTrue($result);
        $this->assertEquals(Notification::STATUS_SCHEDULED, $notification->fresh()->status);
        $this->assertNull($notification->fresh()->error_message);
        
        Queue::assertPushed(\App\Jobs\SendNotificationJob::class);
    }

    /**
     * Test: Relancer une notification qui n'a pas échoué
     */
    public function test_retry_non_failed_notification(): void
    {
        $recipient = User::factory()->create();
        
        $notification = Notification::create([
            'recipient_id' => $recipient->id,
            'subject' => 'Test',
            'body' => 'Test body',
            'status' => Notification::STATUS_SENT,
            'type' => Notification::TYPE_GENERAL,
        ]);

        $result = $this->notificationService->retryFailedNotification($notification);

        $this->assertFalse($result);
    }
}

